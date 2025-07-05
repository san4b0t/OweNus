import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

// Load local model files
const modelJson = require('@/assets/model/model.json');
const modelWeights = require('@/assets/model/group1-shard1of1.bin');

export default function InsightsScreen() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [participants, setParticipants] = useState('');
  const [deadlineMonth, setDeadlineMonth] = useState('');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
        setModel(loadedModel);
      } catch (error) {
        console.error('🚨 Failed to load local model:', error);
        Alert.alert('Model Error', 'Failed to load model. Check the assets or file paths.');
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  const handlePredict = () => {
    if (!model) return;

    const numParticipants = parseFloat(participants);
    const month = parseFloat(deadlineMonth);

    if (isNaN(numParticipants) || isNaN(month)) {
      Alert.alert('Invalid Input', 'Enter valid numbers for both fields.');
      return;
    }

    const input = tf.tensor2d([[numParticipants, month]]);
    const predictionTensor = model.predict(input) as tf.Tensor;
    const predictedValue = predictionTensor.dataSync()[0];

    setPrediction(predictedValue);

    input.dispose();
    predictionTensor.dispose();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading model...</Text>
=======
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
>>>>>>> d0ac0c7e40e7e85af1542f61636785594387843f
      </View>
    );
  }

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>💰 Expense Prediction</Text>

      <Text style={styles.label}>Number of Participants:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={participants}
        onChangeText={setParticipants}
        placeholder="e.g. 3"
      />

      <Text style={styles.label}>Deadline Month (1-12):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={deadlineMonth}
        onChangeText={setDeadlineMonth}
        placeholder="e.g. 7"
      />

      <Button title="Predict Expense" onPress={handlePredict} />

      {prediction !== null && (
        <Text style={styles.result}>Predicted: ${prediction.toFixed(2)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 60,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  result: {
    marginTop: 25,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e88e5',
    textAlign: 'center',
  },
});
=======
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
>>>>>>> d0ac0c7e40e7e85af1542f61636785594387843f
