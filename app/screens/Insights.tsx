import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

const MODEL_URL =
  'https://expensemodel-m6aug6g31-chellu19s-projects.vercel.app';

const InsightsScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<tf.LayersModel | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await tf.loadLayersModel(MODEL_URL);
      setModel(loadedModel);
      setIsReady(true);
    };
    loadModel();
  }, []);

  const handlePredict = async () => {
    if (!model) return;

    setLoading(true);

    // Example input: participant_count = 3, deadline_month = 8
    const inputTensor = tf.tensor2d([[3, 8]], [1, 2]);
    const result = model.predict(inputTensor) as tf.Tensor;
    const value = (await result.data())[0];

    setPrediction(Number(value.toFixed(2)));
    setLoading(false);
  };

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text>Loading model...</Text>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Expense Prediction</Text>

      <Button title="Predict Expense" onPress={handlePredict} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {prediction !== null && (
        <Text style={styles.result}>Predicted Amount: ${prediction}</Text>
      )}
    </View>
  );
};

export default InsightsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 20,
    marginTop: 20,
    color: 'green',
  },
});
