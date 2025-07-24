import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';

export const Auth = {
  async signUp(email: string, password: string, name: string) {
    if (email == "" || password == "" || name == "") throw console.error("Please fill all fields");
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        balance: 0,
        createdAt: new Date(),
      });

      await setDoc(doc(db, 'weights', userCredential.user.uid), {
        uid: userCredential.user.uid,
        paymentHistory: 0,
        totalAmountOwed: 0,
        activeExpenses: 0,
        avgSettlementTime: 0,
        missedPayments: 0,
        totalExpenses: 0,
      })

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },
};