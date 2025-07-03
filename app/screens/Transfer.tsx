import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { UserDataContext } from '@/Global/UserDataContext';
import { NavigationProp } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native';
import ActionButton from '@/assets/components/ActionButton';
import { TransferService } from '../services/TransferService';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Transfer = ({ navigation }: RouterProps) => {

  const [friendName, setFriendName] = useState('');
  const [amount, setAmount] = useState('');
  const { open, isConnected, address, provider } = useWalletConnectModal();

  const onSendTransaction = async () => {
    if (!provider) {
      return;
    }
  
    const chainId = await provider.request({
      method: 'eth_chainId',
    });
    const hexAmt = '0x' + (parseFloat(amount) * 1000000000000000000).toString(16);
    console.log(hexAmt);
  
    const transaction = {
      from: address,
      to: '0x9399b54B05D0b8711Eb2a5839770a5E87a6345b5', // test address
      value: hexAmt,
      chainId,
      data: '0x',
    };
  
    const txResponse = await provider.request({
      method: 'eth_sendTransaction',
      params: [transaction],
    });
  
    return {
      method: 'send transaction',
      result: txResponse,
    };
  };

  const handleTransfer = async () => {
    if (!friendName || !amount) {
      Alert.alert('Error', 'Please enter both friend name and amount');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user || !user.displayName) throw new Error('Not authenticated');

      // get friend data
      const friendDoc = await TransferService.findUserByName(friendName);
      const friendData = friendDoc.data();
      
      // create transaction in the database
      await TransferService.createTransaction(
        user.uid,
        friendData.uid,
        user.displayName,
        friendName,
        amountNumber
      );

      //update balances
      await Promise.all([
        // update sender's balance
        TransferService.updateUserBalance(user.uid, -amountNumber),
        // update receiver's balance
        TransferService.updateUserBalance(friendData.uid, amountNumber),
        // update balance records both ways
        TransferService.updateBalanceRecord(
          user.uid,
          friendData.uid,
          user.displayName,
          friendName,
          amountNumber
        ),
        TransferService.updateBalanceRecord(
          friendData.uid,
          user.uid,
          friendName,
          user.displayName,
          -amountNumber
        )
      ]);

      onSendTransaction();

      Alert.alert(
        'Success', 
        `Successfully transferred $${amountNumber.toFixed(2)} to ${friendName}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Transfer Failed', error.message);
      console.error('Transfer error:', error);
    }
  };

  return (
    <LinearGradient colors = {['rgba(153, 255, 252, 1)', 'rgba(61,150,185,1)','rgba(61,150,185,1)','rgba(15,0,87,1)']} style={styles.gradient}>
    <View style={styles.container}>
      <Image source={require('@/assets/assets/images/coindropping1.png')} style={styles.coin1}/>
      <Text style={styles.title}>Transfer</Text>
      <TextInput
        style={styles.input}
        placeholder="Friend's Username"
        value={friendName}
        onChangeText={setFriendName}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <ActionButton
          imageSource={require('@/assets/assets/images/moneybag.png')}
          label="Transfer"
          onPress={handleTransfer}
        />
        <Image source={require('@/assets/assets/images/coindropping2.png')} style={styles.coin2}/>
    
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: 'ZenDots',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#00177d',
    marginTop: 200,
  },
  input: {
    height: 40,
    borderColor: 'transparent',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
  coin1: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginTop: 10,
  },
  coin2: {
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'center',
    height: 255,
    width: 255,
    alignSelf: 'center',
  },
});

export default Transfer;