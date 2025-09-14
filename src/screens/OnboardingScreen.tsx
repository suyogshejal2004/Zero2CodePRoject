import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  PanResponder
} from 'react-native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const parallaxAnim = useRef(new Animated.Value(0)).current;
  const rotateXAnim = useRef(new Animated.Value(0)).current;

  // Parallax layers
  const parallaxLayers = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  const onboardingScreens = [
    {
      title: "Learn by Doing",
      description: "Write real code from day one with our interactive coding environment.",
      icon: "💻",
      code: `function welcome() {\n  console.log("Start coding!");\n}`,
      color: "#64ffda"
    },
    {
      title: "Instant Feedback",
      description: "Get real-time results and suggestions as you write your code.",
      icon: "⚡",
      code: `if (codeWorks) {\n  celebrate();\n} else {\n  learnMore();\n}`,
      color: "#ff6b6b"
    },
    {
      title: "Master Concepts",
      description: "Progress from basics to advanced topics with structured learning paths.",
      icon: "🚀",
      code: `while(!succeed) {\n  tryAgain();\n  learnFromMistakes();\n}`,
      color: "#74b9ff"
    },
    {
      title: "Build Projects",
      description: "Apply your skills by building real-world applications and projects.",
      icon: "🏗️",
      code: `const portfolio = [\n  projects,\n  skills,\n  achievements\n];`,
      color: "#fdcb6e"
    }
  ];

  // Create pan responder for 3D tilt effect
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { moveX, moveY } = gestureState;
        const centerX = width / 2;
        const centerY = height / 2;
        
        const rotateX = ((moveY - centerY) / centerY) * 10; // Max 10 degrees
        const rotateY = ((moveX - centerX) / centerX) * 10; // Max 10 degrees
        
        rotateXAnim.setValue(rotateX);
        parallaxAnim.setValue(rotateY);
        
        // Move parallax layers at different speeds
        parallaxLayers[0].setValue(rotateY * 0.3);
        parallaxLayers[1].setValue(rotateY * 0.6);
        parallaxLayers[2].setValue(rotateY * 0.9);
      },
      onPanResponderRelease: () => {
        // Return to original position with spring animation
        Animated.parallel([
          Animated.spring(rotateXAnim, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.spring(parallaxAnim, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.spring(parallaxLayers[0], {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.spring(parallaxLayers[1], {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.spring(parallaxLayers[2], {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          })
        ]).start();
      }
    })
  ).current;

  useEffect(() => {
    // Reset animations when screen changes
    flipAnim.setValue(0);
    fadeAnim.setValue(0);
    slideAnim.setValue(0);
    rotateXAnim.setValue(0);
    parallaxAnim.setValue(0);

    // Animate in new screen
    Animated.parallel([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
  }, [currentScreen]);

  const flipInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '0deg']
  });

  const fadeInterpolate = fadeAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1]
  });

  const slideInterpolate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });

  const nextScreen = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  const prevScreen = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const screen = onboardingScreens[currentScreen];

  return (
    <View style={styles.container}>
      {/* Animated background elements with parallax */}
      <Animated.View style={[
        styles.backgroundCircle,
        { 
          backgroundColor: screen.color,
          transform: [
            { translateX: parallaxLayers[0] }
          ]
        }
      ]} />
      
      <Animated.View style={[
        styles.backgroundSquare,
        { 
          borderColor: screen.color,
          transform: [
            { translateX: parallaxLayers[1] }
          ]
        }
      ]} />
      
      <Animated.View style={[
        styles.backgroundHexagon,
        { 
          borderColor: screen.color,
          transform: [
            { translateX: parallaxLayers[2] }
          ]
        }
      ]} />

      <View style={styles.content} {...panResponder.panHandlers}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {onboardingScreens.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.progressDot, 
                index === currentScreen && styles.activeProgressDot,
                index < currentScreen && styles.completedProgressDot
              ]} 
            />
          ))}
        </View>

        {/* 3D Card with enhanced effects */}
        <Animated.View style={[
          styles.card,
          { 
            transform: [
              { rotateY: flipInterpolate },
              { rotateX: rotateXAnim.interpolate({
                inputRange: [-10, 0, 10],
                outputRange: ['-10deg', '0deg', '10deg']
              }) },
              { perspective: 1000 }
            ],
            opacity: fadeInterpolate,
            shadowColor: screen.color,
          }
        ]}>
          <View style={[styles.cardFront, { borderColor: screen.color }]}>
            <Animated.View style={[
              styles.iconContainer,
              { 
                backgroundColor: screen.color,
                transform: [
                  { rotate: flipInterpolate }
                ]
              }
            ]}>
              <Text style={styles.cardIcon}>{screen.icon}</Text>
            </Animated.View>
            
            <Text style={[styles.cardTitle, { color: screen.color }]}>{screen.title}</Text>
            
            <View style={[styles.codeContainer, { borderColor: screen.color }]}>
              <Text style={[styles.codeText, { color: screen.color }]}>{screen.code}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Description with floating animation */}
        <Animated.View style={[
          styles.descriptionContainer,
          { 
            opacity: fadeInterpolate,
            transform: [{ translateY: slideInterpolate }]
          }
        ]}>
          <Text style={styles.cardDescription}>{screen.description}</Text>
        </Animated.View>

        {/* Interactive terminal */}
        <Animated.View style={[
          styles.terminalWindow,
          { 
            opacity: fadeInterpolate,
            transform: [
              { translateY: slideInterpolate },
              { rotateX: rotateXAnim.interpolate({
                inputRange: [-10, 0, 10],
                outputRange: ['-2deg', '0deg', '2deg']
              }) }
            ]
          }
        ]}>
          <View style={styles.terminalHeader}>
            <View style={styles.terminalButtons}>
              <View style={[styles.terminalButton, styles.closeButton]} />
              <View style={[styles.terminalButton, styles.minimizeButton]} />
              <View style={[styles.terminalButton, styles.expandButton]} />
            </View>
            <Text style={styles.terminalTitle}>terminal</Text>
          </View>
          <View style={styles.terminalBody}>
            <Text style={styles.terminalOutput}>
              {currentScreen === 0 && "> Initializing learning environment..."}
              {currentScreen === 1 && "> Code analysis complete!"}
              {currentScreen === 2 && "> Loading advanced concepts... 🎯"}
              {currentScreen === 3 && "> Project template ready! 🚀"}
            </Text>
            <View style={styles.commandLine}>
              <Text style={styles.prompt}>$ </Text>
              <Animated.View style={[
                styles.cursor, 
                { 
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0, 1]
                  })
                }
              ]} />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[
          styles.buttonContainer,
          { 
            opacity: fadeInterpolate,
            transform: [{ translateY: slideInterpolate }]
          }
        ]}>
          <TouchableOpacity 
            style={[styles.button, styles.prevButton, { opacity: currentScreen === 0 ? 0.5 : 1 }]}
            onPress={prevScreen}
            disabled={currentScreen === 0}
          >
            <Text style={styles.buttonText}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.nextButton, { backgroundColor: screen.color }]}
            onPress={nextScreen}
          >
            <Text style={styles.buttonText}>
              {currentScreen === onboardingScreens.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e17',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backgroundCircle: {
    position: 'absolute',
    top: '15%',
    right: '-10%',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.1,
  },
  backgroundSquare: {
    position: 'absolute',
    bottom: '10%',
    left: '-10%',
    width: 250,
    height: 250,
    borderWidth: 1,
    opacity: 0.1,
    transform: [{ rotate: '45deg' }],
  },
  backgroundHexagon: {
    position: 'absolute',
    top: '60%',
    right: '10%',
    width: 150,
    height: 150,
    borderWidth: 1,
    opacity: 0.1,
    transform: [{ rotate: '30deg' }],
  },
  content: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    zIndex: 10,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 6,
  },
  activeProgressDot: {
    backgroundColor: '#64ffda',
    transform: [{ scale: 1.4 }],
  },
  completedProgressDot: {
    backgroundColor: '#64ffda',
  },
  card: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: 'transparent',
    backfaceVisibility: 'hidden',
    marginBottom: 30,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  cardFront: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(18, 25, 42, 0.95)',
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backfaceVisibility: 'hidden',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  cardIcon: {
    fontSize: 40,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  codeContainer: {
    backgroundColor: 'rgba(10, 15, 30, 0.8)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  descriptionContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  cardDescription: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 24,
  },
  terminalWindow: {
    width: '100%',
    backgroundColor: 'rgba(10, 15, 30, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(15, 25, 45, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 255, 218, 0.2)',
  },
  terminalButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  terminalButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  closeButton: {
    backgroundColor: '#ff5f56',
  },
  minimizeButton: {
    backgroundColor: '#ffbd2e',
  },
  expandButton: {
    backgroundColor: '#27c93f',
  },
  terminalTitle: {
    color: '#64ffda',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  terminalBody: {
    padding: 15,
    minHeight: 80,
  },
  terminalOutput: {
    color: '#00ffaa',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 10,
    lineHeight: 20,
  },
  commandLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prompt: {
    color: '#64ffda',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  cursor: {
    width: 8,
    height: 16,
    backgroundColor: '#64ffda',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  prevButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButton: {
    backgroundColor: '#64ffda',
  },
  buttonText: {
    color: '#0a0e17',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OnboardingScreen;