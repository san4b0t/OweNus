import { doc, getDoc, query, setDoc, collection, where, orderBy, getDocs, updateDoc } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from '@/FirebaseConfig';
import { Alert } from 'react-native';

interface CreditScoreResult {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export const CreditScoringService = {
  async calculateCreditScore(): Promise<CreditScoreResult> {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) throw new Error('User not authenticated');

    const indivExpensesQuery = query(
      collection(db, 'indivExpenses'),
      where('paidBy', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const indivExpensesSnapshot = await getDocs(indivExpensesQuery);
    const indivExpenses = indivExpensesSnapshot.docs.map(doc => doc.data());

    const weightsRef = doc(db, 'weights', user.uid);
    const weightsSnap = await getDoc(weightsRef);

    if (!weightsSnap.exists()) {
      await setDoc(doc(db, 'weights', user.uid), {
                uid: user.uid,
                paymentHistory: 0,
                totalAmountOwed: 0,
                activeExpenses: 0,
                avgSettlementTime: 0,
                missedPayments: 0,
                totalExpenses: 0,
              })
      return this.calculateCreditScore();
    }

    await updateDoc(doc(db, 'weights', user.uid), {
      paymentHistory: await this.calculatePaymentHistory(indivExpenses),
      totalAmountOwed: await this.calculateTotalAmountOwed(indivExpenses),
      activeExpenses: await this.calculateActiveExpenses(indivExpenses),
      avgSettlementTime: await this.calculateAvgSettlementTime(indivExpenses),
      missedPayments: await this.calculateMissedPayments(indivExpenses),
      totalExpenses: indivExpenses.length,
    })

    const weightsRef2 = doc(db, 'weights', user.uid);
    const weightsSnap2 = await getDoc(weightsRef2);

    const data = weightsSnap2.data();

    //weighted scoring model
    let score = data?.totalExpenses == 0 ? 100 :
      0.4 * (data?.paymentHistory ?? 0) +
      0.1 * (data?.avgSettlementTime ?? 0) +
      0.2 * (data?.missedPayments ?? 0) +
      0.15 * (data?.totalAmountOwed ?? 0) +
      0.1 * (data?.activeExpenses ?? 0) +
      0.05 * (data?.totalExpenses ?? 0);

    score = Math.max(0, Math.min(Math.round(score), 100));

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      creditScore: score
    });

    const res = {
      score,
      status: this.determineCreditStatus(score)
    };
    console.log(res);
    Alert.alert(`Credit Score: ${res.score}`, `Status: ${res.status}`);
    return res;
  },

  determineCreditStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  },

  async calculatePaymentHistory(expenses: any[]): Promise<number> {
    const totalExpenses = expenses.length;
    if (totalExpenses === 0) return 0;

    const onTimePayments = expenses.filter(
      expense => expense.status === 'paid' &&
      expense.deadline?.toDate() >= expense.createdAt?.toDate()
    ).length;

    return (onTimePayments / totalExpenses) * 100;
  },

  async calculateTotalAmountOwed(expenses: any[]): Promise<number> {
    const pendingExpenses = expenses.filter(expense => expense.status === 'pending');
    const totalOwed = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return Math.min(totalOwed / 10000 * 100, 100); 
  },

  async calculateActiveExpenses(expenses: any[]): Promise<number> {
    const active = expenses.filter(expense => expense.status === 'pending').length;
    return expenses.length == 0 ? 0 : (active / expenses.length) * 100;
  },

  async calculateAvgSettlementTime(expenses: any[]): Promise<number> {
    const paidExpenses = expenses.filter(expense => expense.status === 'paid');
    if (paidExpenses.length === 0) return 0;

    const totalDays = paidExpenses.reduce((sum, expense) => {
      const createdAt = expense.createdAt?.toDate() || new Date();
      const deadline = expense.deadline?.toDate() || new Date();
      return sum + (deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    }, 0);

    const avgDays = totalDays / paidExpenses.length;
    return Math.min(avgDays / 30 * 100, 100);
  },

  async calculateMissedPayments(expenses: any[]): Promise<number> {
    const missed = expenses.filter(
      expense => expense.status === 'pending' &&
      expense.deadline?.toDate() < new Date()
    ).length;
    return expenses.length == 0 ? 0 : (missed / expenses.length) * 100;
  },
};
