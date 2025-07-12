// src/services/transactionService.ts
import { db } from '@/FirebaseConfig';
import { addDoc, collection, doc, getDocs, query, updateDoc, where, increment } from 'firebase/firestore';
import { useState } from 'react';

export const TransferService = {
  async findUserByName(name: string) {
    const q = query(collection(db, 'users'), where('name', '==', name));
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error(`User ${name} not found`);
    return snapshot.docs[0];
  },

  async createTransaction(fromUid: string, toUid: string, fromName: string, toName: string, amount: number) {
    await addDoc(collection(db, 'transactions'), {
      from: fromUid,
      fromName,
      to: toUid,
      toName,
      amount,
      settledAt: new Date(),
    });
  },

  async updateUserBalance(uid: string, amount: number) {
    const userDoc = await this.getUserDocument(uid);
    await updateDoc(userDoc.ref, {
      balance: increment(amount)
    });
  },

  async updateBalanceRecord(userId: string, friendId: string, userName: string, friendName: string, amount: number) {
    const balanceQuery = query(
      collection(db, 'balances'),
      where('userId', '==', userId),
      where('friendId', '==', friendId)
    );

    const snapshot = await getDocs(balanceQuery);
    
    if (snapshot.empty) {
      await addDoc(collection(db, 'balances'), {
        userId,
        userName,
        friendId,
        friendName,
        amount
      });
    } else {
      await updateDoc(snapshot.docs[0].ref, {
        amount: increment(amount)
      });
    }
  },

  async getUserDocument(uid: string) {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error('User not found');
    return snapshot.docs[0];
  },
  
 async fetchPrice () {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=sgd');
      const data = await response.json();
      const price = data.ethereum.sgd;
      return price ? price : Error
    } catch (err) {
      console.error(err);
    }
  }
  
};