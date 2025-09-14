import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

// Replace with your actual Lottie animation import
const CodingAnimation = require('../asset/Codinganimation.json');

const LoginScreen = ({ onLogin, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const lottieRef = useRef(null);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Play Lottie animation
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleSignup = () => {
    onSignup();
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <LinearGradient
      colors={['#0a0e17', '#1a1a3a']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Animated background elements */}
          <View style={styles.backgroundCircle} />
          <View style={styles.backgroundSquare} />

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header with logo and animation */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.cube}>
                  <View style={[styles.face, styles.front]}>
                    <Text style={styles.codeSymbol}>&lt;/&gt;</Text>
                  </View>
                </View>
              </View>

              <View style={styles.animationContainer}>
                <LottieView
                  ref={lottieRef}
                  source={CodingAnimation}
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
              </View>

              <Text style={styles.title}>CODEMASTER</Text>
              <Text style={styles.subtitle}>
                Login to continue your coding journey
              </Text>
            </View>

            {/* Terminal-style login form */}
            <View style={styles.terminal}>
              <View style={styles.terminalHeader}>
                <View style={styles.terminalButtons}>
                  <View style={[styles.terminalButton, styles.closeButton]} />
                  <View style={[styles.terminalButton, styles.minimizeButton]} />
                  <View style={[styles.terminalButton, styles.expandButton]} />
                </View>
                <Text style={styles.terminalTitle}>login-terminal</Text>
              </View>

              <View style={styles.terminalBody}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email:</Text>
                  <TextInput
                    style={[
                      styles.input,
                      activeField === 'email' && styles.inputFocused,
                    ]}
                    placeholder="user@codemaster.com"
                    placeholderTextColor="rgba(100, 255, 218, 0.5)"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password:</Text>
                  <TextInput
                    style={[
                      styles.input,
                      activeField === 'password' && styles.inputFocused,
                    ]}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(100, 255, 218, 0.5)"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setActiveField('password')}
                    onBlur={() => setActiveField(null)}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                onPressIn={animateButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.loginButtonText}>Authenticating...</Text>
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Signup section */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>

            {/* Social login options */}
            <View style={styles.socialContainer}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>G</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>f</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  backgroundCircle: {
    position: 'absolute',
    top: '10%',
    right: '-10%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  backgroundSquare: {
    position: 'absolute',
    bottom: '15%',
    left: '-10%',
    width: 250,
    height: 250,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.1)',
    opacity: 0.1,
    transform: [{ rotate: '45deg' }],
  },
  content: { padding: 20, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  logoContainer: { marginBottom: 20 },
  cube: { width: 80, height: 80, position: 'relative' },
  face: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(18, 25, 42, 0.95)',
    borderWidth: 2,
    borderColor: '#64ffda',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  front: { transform: [{ rotateY: '0deg' }] },
  codeSymbol: { fontSize: 24, fontWeight: 'bold', color: '#64ffda' },
  animationContainer: { width: 120, height: 120, marginBottom: 10 },
  lottieAnimation: { width: '100%', height: '100%' },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64ffda',
    marginBottom: 8,
    letterSpacing: 3,
  },
  subtitle: { fontSize: 16, color: '#e0e0e0', textAlign: 'center' },
  terminal: {
    width: '100%',
    backgroundColor: 'rgba(10, 15, 30, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(15, 25, 45, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 255, 218, 0.2)',
  },
  terminalButtons: { flexDirection: 'row', marginRight: 10 },
  terminalButton: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  closeButton: { backgroundColor: '#ff5f56' },
  minimizeButton: { backgroundColor: '#ffbd2e' },
  expandButton: { backgroundColor: '#27c93f' },
  terminalTitle: { color: '#64ffda', fontSize: 12, fontFamily: 'monospace' },
  terminalBody: { padding: 20 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { color: '#64ffda', fontSize: 14, fontFamily: 'monospace', marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(18, 25, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    borderRadius: 8,
    padding: 12,
    color: '#64ffda',
    fontFamily: 'monospace',
  },
  inputFocused: {
    borderColor: '#64ffda',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  forgotPassword: { alignSelf: 'flex-end', marginTop: -10, marginBottom: 10 },
  forgotPasswordText: { color: 'rgba(100, 255, 218, 0.7)', fontSize: 12 },
  loginButton: {
    backgroundColor: '#64ffda',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: width * 0.8,
    alignItems: 'center',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#0a0e17', fontWeight: 'bold', fontSize: 16 },
  signupContainer: { flexDirection: 'row', marginTop: 20, marginBottom: 30 },
  signupText: { color: '#e0e0e0', fontSize: 14 },
  signupLink: { color: '#64ffda', fontWeight: 'bold', fontSize: 14 },
  socialContainer: { width: '100%' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(100, 255, 218, 0.3)' },
  dividerText: { color: 'rgba(100, 255, 218, 0.7)', marginHorizontal: 10, fontSize: 12 },
  socialButtons: { flexDirection: 'row', justifyContent: 'center' },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(18, 25, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialButtonText: { color: '#64ffda', fontWeight: 'bold', fontSize: 16 },
});

export default LoginScreen;
