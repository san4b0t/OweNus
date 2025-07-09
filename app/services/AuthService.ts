import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';

export const Auth = {
  async signUp(email: string, password: string, name: string, walletId: string) {
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
        walletId: walletId,
      });

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