import { doc, getDoc } from 'firebase/firestore';
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

    const weightsRef = doc(db, 'weights', user.uid);
    const weightsSnap = await getDoc(weightsRef);

    if (!weightsSnap.exists()) {
      return {
        score: 100,
        status: 'excellent'
      };
    }

    const data = weightsSnap.data();

    // Weighted scoring model
    let score =
      0.4 * (data.paymentHistory ?? 0) +
      0.1 * (data.avgSettlementTime ?? 0) +
      0.2 * (data.missedPayments ?? 0) +
      0.15 * (data.totalAmountOwed ?? 0) +
      0.1 * (data.activeExpenses ?? 0) +
      0.05 * (data.totalExpenses ?? 0);

    score = Math.max(0, Math.min(Math.round(score), 100));

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
  }
};
