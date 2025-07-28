import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from '../../FirebaseConfig';
import { useState } from 'react';
import { MY_API_KEY } from '@env';

const API_KEY = MY_API_KEY; 

const fetchPastExpenses = async () => {
  const user = FIREBASE_AUTH.currentUser;

  //query the 50 most recent expenses
  const expensesQuery = query(
    collection(db, 'indivExpenses'),
    where('paidBy', '==', user?.uid),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(expensesQuery, (snapshot) => {
    const expensesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as { description?: string })
    })).slice(0, 20);
    return JSON.stringify(expensesData);
  });
}


export const handler = async (months: number, participants: number) => {
    console.log("fetching past expenses...");

    const expenses = fetchPastExpenses();

    console.log("calling now...");

    const APIBody = {
    model: "gpt-4", 
    max_tokens: 100,
    messages: [
        { role: "system", content: "You are predicting expenses." },
        { role: "user", content: "I am giving you expenses data. When a user pays for others in a group expense, that expense is logged and split into indivExpenses for each participant in the expense. This indivExpense object tracks when each participant pays back or if they have even paid back to the user to who paid for the group expense. The indivExpenses data I am giving you is the 50 most recent ones. Based on how punctual the repayments are with respect to their deadlines, given a new number of particpants and number of months as deadline, predict the expected loss from the expense. Loss means some people are not going to repay back. If loss is zero means everybody will repay back. Just look at the data and make a rough guess that sounds believable." + "past indivExpenses: " + expenses + `new expense participants number: ${participants}` + `new expense deadline: ${months} months` + "don't tell me your thoughts, all I need is a number from you. Switch up your predictions as well. Give me your prediction as a negative number. Keep your prediction within the highest and lowest indiv expense amount in the data i give you. Larger number of deadline months reduce prediction, vice versa. Larger number of participants increase prediction, vice versa."}
      ]
    };

    try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + API_KEY,
      },
      body: JSON.stringify(APIBody),
    });

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content;
    if (content) {
      console.log("Prediction", content);
      return content;
    } else {
      console.warn("No content returned.");
    }
  } catch (err) {
    console.error("OpenAI API call failed:", err);
  }
  };