import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

// Replace with your success Lottie animation
const SuccessAnimation = require('../asset/successanimation.json');

const SuccessScreen = ({ message, onContinue }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const lottieRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  return (
    <LinearGradient
      colors={['#0a0e17', '#1a1a3a']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LottieView
          ref={lottieRef}
          source={SuccessAnimation}
          autoPlay
          loop={false}
          style={styles.lottieAnimation}
        />

        <Text style={styles.title}>Success!</Text>
        <Text style={styles.message}>{message}</Text>

        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', padding: 20 },
  lottieAnimation: { width: 200, height: 200, marginBottom: 20 },
  title: { fontSize: 32, color: '#64ffda', fontWeight: 'bold', marginBottom: 10 },
  message: { fontSize: 16, color: '#e0e0e0', textAlign: 'center', marginBottom: 30 },
  button: {
    backgroundColor: '#64ffda',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { color: '#0a0e17', fontWeight: 'bold', fontSize: 16 },
});

export default SuccessScreen;
