import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

const MODEL_URL = 'https://expensemodel-m6aug6g31-chellu19s-projects.vercel.app/model.json';

const InsightsScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<tf.LayersModel | tf.GraphModel | null>(null);

useEffect(() => {
  const loadModel = async () => {
    try {
      await tf.ready();

      try {
        const loadedModel = await tf.loadLayersModel(MODEL_URL);
        setModel(loadedModel);
        console.log('Loaded as LayersModel');
      } catch (layersError) {
        console.log('LayersModel failed, trying GraphModel...');
        const graphModel = await tf.loadGraphModel(MODEL_URL);
        setModel(graphModel);
        console.log('Loaded as GraphModel');
      }
      
      setIsReady(true);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };
  loadModel();
}, []);

  const handlePredict = async () => {
    if (!model) return;

    setLoading(true);

    try {
      const inputTensor = tf.tensor2d([[3, 8]], [1, 2]);
      const prediction = model.predict(inputTensor);

      let value: number;
      
      if (Array.isArray(prediction)) {
        value = (await prediction[0].data())[0];
        prediction.forEach(tensor => tensor.dispose());
      } else {
        value = (await prediction.data())[0];
        prediction.dispose();
      }

      inputTensor.dispose();
      setPrediction(Number(value.toFixed(2)));
      
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
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