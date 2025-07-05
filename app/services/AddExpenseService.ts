// src/services/expenseService.ts
import { db, FIREBASE_AUTH } from '@/FirebaseConfig';
import { addDoc, collection, getDocs, query, updateDoc, where, increment, serverTimestamp, Timestamp } from 'firebase/firestore';


export const AddExpenseService = {
  async createExpense(description: string, amount: number, participantNames: string[], deadlineDate: Date) {
    const user = FIREBASE_AUTH.currentUser;
    if (!user || !user.displayName) throw new Error('Not authenticated');

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const year = now.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const deadlineTimestamp = Timestamp.fromDate(deadlineDate);
    // add expense to db
    const expenseRef = await addDoc(collection(db, 'expenses'), {
      description,
      amount,
      paidBy: user.uid,
      paidByName: user.displayName,
      participants: participantNames,
      createdAt: serverTimestamp(),
      date: formattedDate, 
      time: now.toLocaleTimeString(),
      deadline: deadlineTimestamp, 
      status: 'pending'
    });

    // update user balance as they pay for the expense
    await this.updateUserBalance(user.uid, -amount);

    // update amount owed for each participant in the expense
    const amountPerPerson = amount / participantNames.length;
    await Promise.all(
      participantNames.map(async (name) => {
        
        const participant = await this.findUserByName(name.trim());

        // add indiv expense object with deadline for each participant
        await addDoc(collection(db, 'indivExpenses'), {
          description,
          amount: amountPerPerson,
          paidBy: user.uid,
          paidByName: user.displayName,
          participant: participant.name,
          participantId: participant.uid,
          createdAt: serverTimestamp(),
          date: formattedDate, 
          time: now.toLocaleTimeString(),
          deadline: deadlineTimestamp, 
          status: 'pending'
        });


        // update balances owed to and from for each participant in the expense
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

  async createCustomExpense(description: string, amount: number, participantNames: string[], splits: number[], deadlineDate: Date) {
    const user = FIREBASE_AUTH.currentUser;
    if (!user || !user.displayName) throw new Error('Not authenticated');

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const year = now.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const deadlineTimestamp = Timestamp.fromDate(deadlineDate);
    // add expense to db
    const expenseRef = await addDoc(collection(db, 'expenses'), {
      description,
      amount,
      paidBy: user.uid,
      paidByName: user.displayName,
      participants: participantNames,
      createdAt: serverTimestamp(),
      date: formattedDate, 
      time: now.toLocaleTimeString(),
      deadline: deadlineTimestamp, 
      status: 'pending'
    });

    // update user balance as they pay for the expense
    await this.updateUserBalance(user.uid, -amount);
    
    const merged = participantNames.map((item, index) => [item.trim(), splits[index]])
    
    await Promise.all(
      merged.map(async (m) => {
        const name = m[0] as string;
        const portion = m[1] as number;
        const amt = portion / 100 * amount;
        if (name === user.displayName) return;
        
        const participant = await this.findUserByName(name);

        // add indiv expense object with deadline for each participant
        await addDoc(collection(db, 'indivExpenses'), {
          description,
          amount: amt,
          paidBy: user.uid,
          paidByName: user.displayName,
          participant: participant.name,
          participantId: participant.uid,
          createdAt: serverTimestamp(),
          date: formattedDate, 
          time: now.toLocaleTimeString(),
          deadline: deadlineTimestamp, 
          status: 'pending'
        });


        // update balances owed to and from for each participant in the expense
        await this.updateBalanceRecords(
          user.uid,
          participant.uid,
          user.displayName || 'Unknown User',
          participant.name,
          amt
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