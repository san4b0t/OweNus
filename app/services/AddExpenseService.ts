// src/services/expenseService.ts
import { db, FIREBASE_AUTH } from '@/FirebaseConfig';
import { addDoc, collection, getDocs, query, updateDoc, where, increment } from 'firebase/firestore';

export const AddExpenseService = {
  async createExpense(description: string, amount: number, participantNames: string[]) {
    const user = FIREBASE_AUTH.currentUser;
    if (!user || !user.displayName) throw new Error('Not authenticated');

    // add expense to db
    const expenseRef = await addDoc(collection(db, 'expenses'), {
      description,
      amount,
      paidBy: user.uid,
      paidByName: user.displayName,
      participants: participantNames,
      createdAt: new Date(),
    });

    // update user balance as they pay for the expense
    await this.updateUserBalance(user.uid, -amount);

    // update amount owed for each participant in the expense
    const amountPerPerson = amount / participantNames.length;
    await Promise.all(
      participantNames.map(async (name) => {
        if (name.trim() === user.displayName) return;
        
        const participant = await this.findUserByName(name.trim());
        await this.updateBalanceRecords(
          user.uid,
          participant.uid,
          user.displayName || 'Unknown User',
          participant.name,
          amountPerPerson
        );
      })
    );

    return expenseRef.id;
  },

  async findUserByName(name: string) {
    const q = query(collection(db, 'users'), where('name', '==', name));
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error(`User ${name} not found`);
    return { 
      uid: snapshot.docs[0].data().uid,
      name: snapshot.docs[0].data().name
    };
  },

  async updateUserBalance(uid: string, amount: number) {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error('User not found');
    await updateDoc(snapshot.docs[0].ref, {
      balance: increment(amount)
    });
  },

  async updateBalanceRecords(
    userId: string,
    friendId: string,
    userName: string,
    friendName: string,
    amount: number
  ) {
    // update user balance owed from participants
    await this.updateSingleBalance(
      userId,
      friendId,
      userName,
      friendName,
      amount
    );

    // update particpant balances owed to user
    await this.updateSingleBalance(
      friendId,
      userId,
      friendName,
      userName,
      -amount
    );
  },

  async updateSingleBalance(
    userId: string,
    friendId: string,
    userName: string,
    friendName: string,
    amount: number
  ) {
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
  }
};