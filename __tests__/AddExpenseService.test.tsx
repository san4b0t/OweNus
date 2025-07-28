// __tests__/services/expenseService.test.ts
import { AddExpenseService } from '../app/services/AddExpenseService';
import { db, FIREBASE_AUTH } from '@/FirebaseConfig';
import { addDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

// Mock Firebase dependencies
jest.mock('@/FirebaseConfig', () => ({
  db: {},
  FIREBASE_AUTH: {
    currentUser: {
      uid: 'ghtygiggig',
      displayName: 'testuser'
    }
  }
}));

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  updateDoc: jest.fn(),
  increment: jest.fn(),
  serverTimestamp: jest.fn(() => 'MOCK_TIMESTAMP'),
  Timestamp: {
    fromDate: jest.fn((date) => ({ seconds: date.getTime() / 1000 }))
  },
  collection: jest.fn((db, collectionName) => collectionName)
}));

describe('AddExpenseService', () => {
  const mockDate = new Date('2023-01-01');
  
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(mockDate);
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('createExpense', () => {

    it('should throw error when not authenticated', async () => {
      (FIREBASE_AUTH.currentUser as any) = null;
      await expect(
        AddExpenseService.createExpense('Test', 100, [], new Date())
      ).rejects.toThrow('Not authenticated');
    });
  });

  describe('updateBalanceRecords', () => {
    it('should update balance records for both users', async () => {
      (getDocs as jest.Mock)
        .mockResolvedValueOnce({ empty: true })
        .mockResolvedValueOnce({ empty: true });

      await AddExpenseService.updateBalanceRecords(
        'user123', 'friend123', 'Test User', 'Friend', 50
      );

      expect(addDoc).toHaveBeenCalledTimes(2);
      expect(addDoc).toHaveBeenCalledWith('balances', expect.any(Object));
    });
  });

  describe('updateSingleBalance', () => {
    it('should create new balance record if none exists', async () => {
      (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });
      await AddExpenseService.updateSingleBalance(
        'user123', 'friend123', 'Test User', 'Friend', 25
      );
      expect(addDoc).toHaveBeenCalledWith('balances', expect.any(Object));
    });

    it('should update existing balance record', async () => {
      (getDocs as jest.Mock).mockResolvedValueOnce({
        empty: false,
        docs: [{ ref: 'existingBalanceRef' }]
      });
      await AddExpenseService.updateSingleBalance(
        'user123', 'friend123', 'Test User', 'Friend', 15
      );
      expect(updateDoc).toHaveBeenCalledWith('existingBalanceRef', expect.any(Object));
    });
  });
});