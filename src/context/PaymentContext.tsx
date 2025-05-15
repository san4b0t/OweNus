import React, { createContext, useEffect, useState } from 'react';
import { getPayments } from '../services/paymentService';

export const PaymentContext = createContext({
  payments: [] as any[],
  addPayment: (payment: any) => {},
  refreshPayments: () => {}
});

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [payments, setPayments] = useState<any[]>([]);

  const refreshPayments = async () => {
    const loadedPayments = await getPayments();
    setPayments(loadedPayments);
  };

  useEffect(() => {
    refreshPayments();
  }, []);

  const addPayment = async (payment: any) => {
    setPayments([...payments, payment]);
  };

  return (
    <PaymentContext.Provider value={{ payments, addPayment, refreshPayments }}>
      {children}
    </PaymentContext.Provider>
  );
}