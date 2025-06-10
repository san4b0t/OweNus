// src/services/userService.ts
import { db, FIREBASE_AUTH } from '../../FirebaseConfig';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';

export const TopUp = {
  async getCurrentUserDoc() {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) throw new Error('Not authenticated');

    const userQuery = query(
      collection(db, 'users'),
      where('uid', '==', user.uid)
    );

    const snapshot = await getDocs(userQuery);
    if (snapshot.empty) throw new Error('User document not found');
    
    return snapshot.docs[0];
  },

  async updateUserBalance(amount: number) {
    try {
      const userDoc = await this.getCurrentUserDoc();
      const currentBalance = userDoc.data().balance || 0;
      
      await updateDoc(userDoc.ref, {
        balance: currentBalance + amount
      });

      return currentBalance + amount;
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  },
};