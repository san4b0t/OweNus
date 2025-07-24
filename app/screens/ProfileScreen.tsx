import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { CreditScoringService } from '../services/CreditScoringService'; 
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const ProfileScreen = () => {
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [creditStatus, setCreditStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const result = await CreditScoringService.calculateCreditScore();
        setCreditScore(result.score);
        setCreditStatus(result.status);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  const getColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#004302ff';
      case 'good': return '#2a9d00ff';
      case 'fair': return '#ffb300ff';
      case 'poor': return '#ad0c00ff';
      default: return '#9e9e9e';
    }
  };
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  const getImage = (status: string) => {
    switch (status.toLowerCase()) {
        case 'excellent': return require('@/assets/assets/images/excellent.png');
        case 'good': return require('@/assets/assets/images/good.png');
        case 'fair': return require('@/assets/assets/images/fair.png');
        case 'poor': return require('@/assets/assets/images/poor.png');
        default: return require('@/assets/assets/images/defaultmeme.png');
    }
    };

  return (
    <LinearGradient colors={[
            'rgba(153, 255, 252, 1)',
            'rgba(61,150,185,1)',
            'rgba(61,150,185,1)',
            'rgba(15,0,87,1)',]} style={styles.gradient}>
    <View style={styles.container}>
    <Text style={styles.heading}>Your Credit Score</Text>
    
     <View style={styles.card}>
        <AnimatedCircularProgress
          size={180}
          width={15}
          fill={creditScore ?? 0}
          tintColor={getColor(creditStatus)}
          backgroundColor="#700000"
        >
        {(fill: number) => ( <Text style={[styles.scoreText, { color: getColor(creditStatus) }]}>
        {Math.round(fill)}
        </Text> )}
        </AnimatedCircularProgress>
        <Text style={[styles.statusText, { color: getColor(creditStatus) }]}>
          {creditStatus.charAt(0).toUpperCase() + creditStatus.slice(1)}
        </Text>
      </View>
      <Image source={getImage(creditStatus)} style={styles.memeImage} resizeMode="contain" />
    </View>
    
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 10,
        
    },
  gradient: {
    display: 'flex',
    flex: 1,

  },
  heading: {
    marginTop: 12,
    fontFamily: 'Orbitron',
    fontSize: 32,
    fontWeight: '600',
    color: 'rgba(1, 0, 68, 0.9)',
    textAlign: 'center',
  },
  
  card: {
    marginTop: 24,
    width: 240,
    aspectRatio: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  scoreText: {
    fontSize: 48,
    fontFamily: 'PressStart2P',
    fontWeight: '700',
    color: '#010040ff',
  },
  statusText: {
    fontSize: 20,
    marginTop: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
    fontFamily: 'Orbitron',
  },
  memeImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 12,
    alignSelf: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
