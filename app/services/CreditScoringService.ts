import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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

    // Fetch paid expenses with paymentDiff field
    const expensesQuery = query(
      collection(db, 'indivExpenses'),
      where('participant', '==', user.uid),
      where('status', '==', 'paid'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(expensesQuery);
    const expenses = snapshot.docs.map(doc => doc.data());

    if (expenses.length === 0) {
      return {
        score: 100,
        status: 'excellent'
      };
    }

    let score = 100;

    expenses.forEach(expense => {
      const paymentDiff = expense.paymentDiff ?? 0;
      if (paymentDiff <= 0) {
        // On time or early: small bonus (cap at 100)
        score = Math.min(score + 2, 100);
      } else {
        // Late payments: subtract 5 points per day late
        score -= 5 * paymentDiff;
      }
    });

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(score, 100));

    const res = {
      score,
      status: this.determineCreditStatus(score)
    };
    console.log(res);
    Alert.alert(res.toString());
    return res;
  },

  determineCreditStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }
};