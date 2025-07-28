import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, TextInput, Image, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/core';
import { handler } from '@/assets/model/model';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const modelJson = require('@/assets/model/model.json');
const modelWeights = require('@/assets/model/group1-shard1of1.bin');

export default function InsightsScreen() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [participants, setParticipants] = useState('');
  const [deadlineMonth, setDeadlineMonth] = useState('');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
        setModel(loadedModel);
        
      } catch (error) {
        console.error('🚨 Failed to load local model:', error);
        // Alert.alert('Model Error', 'Failed to load model. Check the assets or file paths.');
        
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  const handlePredict = async () => {

    const numParticipants = parseFloat(participants);
    const month = parseFloat(deadlineMonth);

    if (isNaN(numParticipants) || isNaN(month)) {
      Alert.alert('Invalid Input', 'Enter valid numbers for both fields.');
      return;
    }
    
    const input = tf.tensor2d([[numParticipants, month]]);
    const predictionTensor = model?.predict(input) as tf.Tensor;
    const num = await handler(month, numParticipants);
    const predictedValue = predictionTensor.dataSync()[0];
    input.dispose();
    predictionTensor.dispose();
    setPrediction(num);
    return

  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading model...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <LinearGradient 
         colors = {['rgba(153, 255, 252, 1)', 'rgba(61,150,185,1)','rgba(61,150,185,1)','rgba(15,0,87,1)']} 
         style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>💰 Expense Predictor</Text>

        <View style={styles.inputCard}>
          <Text style={styles.label}>👥 Participants</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={participants}
            onChangeText={setParticipants}
            placeholder="e.g. 3"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>📅 Deadline Month (1-12)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={deadlineMonth}
            onChangeText={setDeadlineMonth}
            placeholder="e.g. 7"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity onPress={handlePredict} style={styles.glassButton} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Predict Expense</Text>
          </TouchableOpacity>
        </View>

        {prediction !== null && (
          <View style={styles.resultCard}>
            <Ionicons name="trending-down" size={24} color="#ffa600ff" />
            <Text style={styles.result}>${prediction}</Text>
          </View>
        )}
      </View>
      <Image
        source={require('@/assets/assets/images/insights.png')}
        style={styles.insights}
      />
      <Image
        source={require('@/assets/assets/images/computer.png')}
        style={styles.computer}
      />
    </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    marginTop: 90,
  },
  title: {
    fontSize: 30,
    fontFamily: 'ZenDots',
    fontWeight: 'bold',
    color: '#05008a',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
  label: {
    fontFamily:'PressStart2P',
    color: '#05008a',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#fff7d1',
    fontFamily: 'ZenDots',
    fontSize: 16,
    paddingVertical: 6,
  },
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    fontFamily: 'ZenDots',
    color: '#fff7d1',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    borderColor : 'rgba(255,255,255,0.1)',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  result: {
    fontSize: 22,
    fontFamily: 'Orbitron',
    color: '#f0a207',
    fontWeight: 'bold',
    marginTop: 8,
  },
  insights: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 110, 
    height: 110,
    opacity: 0.7,
    transform: [{ rotate: '10deg' }],
    zIndex: -1,
  },
  computer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 130, 
    height: 130,
    opacity: 0.7,
    transform: [{ rotate: '350deg' }],
    zIndex: -1,
  }
});