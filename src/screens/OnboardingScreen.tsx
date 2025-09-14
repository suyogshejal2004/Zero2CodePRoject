import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

// Replace these with your actual Lottie animation imports
const CodingAnimation = require('../asset/Codinganimation.json');
const RocketAnimation = require('../asset/rocket.json');
const IdeaAnimation = require('../asset/Ideaanimation.json')
const SuccessAnimation = require('../asset/successanimation.json');

const OnboardingScreen = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const progress = useSharedValue(0);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(0);
  const descriptionOpacity = useSharedValue(0); // Using Reanimated for consistency
  const lottieRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const onboardingScreens = [
    {
      title: "Learn by Doing",
      description: "Write real code from day one with our interactive coding environment.",
      icon: "💻",
      code: `function welcome() {\n  console.log("Start coding!");\n}`,
      color: "#64ffda",
      animation: CodingAnimation,
      animationText: "> Initializing learning environment..."
    },
    {
      title: "Instant Feedback",
      description: "Get real-time results and suggestions as you write your code.",
      icon: "⚡",
      code: `if (codeWorks) {\n  celebrate();\n} else {\n  learnMore();\n}`,
      color: "#ff6b6b",
      animation: RocketAnimation,
      animationText: "> Code analysis complete!"
    },
    {
      title: "Master Concepts",
      description: "Progress from basics to advanced topics with structured learning paths.",
      icon: "🚀",
      code: `while(!succeed) {\n  tryAgain();\n  learnFromMistakes();\n}`,
      color: "#74b9ff",
      animation: IdeaAnimation,
      animationText: "> Loading advanced concepts... 🎯"
    },
    {
      title: "Build Projects",
      description: "Apply your skills by building real-world applications and projects.",
      icon: "🏗️",
      code: `const portfolio = [\n  projects,\n  skills,\n  achievements\n];`,
      color: "#fdcb6e",
      animation: SuccessAnimation,
      animationText: "> Project template ready! 🚀"
    }
  ];

  useEffect(() => {
    // Reset animations when screen changes
    progress.value = withTiming(0, { duration: 0 });
    rotateX.value = withTiming(0, { duration: 0 });
    rotateY.value = withTiming(0, { duration: 0 });
    cardScale.value = withTiming(1, { duration: 0 });
    buttonOpacity.value = withTiming(0, { duration: 0 });
    descriptionOpacity.value = withTiming(0, { duration: 0 });

    // Play the Lottie animation for the current screen
    if (lottieRefs[currentScreen].current) {
      lottieRefs[currentScreen].current.reset(); // Reset to start from the beginning
      lottieRefs[currentScreen].current.play();
    }

    // Animate in new screen
    progress.value = withTiming(1, { duration: 800 });
    cardScale.value = withSequence(
      withTiming(1.1, { duration: 300 }),
      withSpring(1, { damping: 10 })
    );
    buttonOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    descriptionOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));

  }, [currentScreen]);

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

  const onGestureEvent = (event) => {
    'worklet';
    const { translationX, translationY } = event;
    rotateX.value = translationY / 20;
    rotateY.value = translationX / 20;
  };

  const onHandlerStateChange = (event) => {
    'worklet';
    if (event.nativeEvent.state === 5) { // END state
      rotateX.value = withSpring(0, { damping: 10 });
      rotateY.value = withSpring(0, { damping: 10 });
    }
  };

  const screen = onboardingScreens[currentScreen];

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotateXValue = interpolate(
      rotateX.value,
      [-10, 10],
      [-10, 10],
      Extrapolate.CLAMP
    );
    const rotateYValue = interpolate(
      rotateY.value,
      [-10, 10],
      [-10, 10],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateXValue}deg` },
        { rotateY: `${rotateYValue}deg` },
        { scale: cardScale.value },
      ],
      shadowOffset: {
        width: -rotateYValue * 2,
        height: rotateXValue * 2,
      },
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{
        translateY: interpolate(
          buttonOpacity.value,
          [0, 1],
          [20, 0]
        )
      }]
    };
  });

  const lottieAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: interpolate(
          progress.value,
          [0, 1],
          [0.8, 1]
        )
      }]
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateX: interpolate(
            rotateY.value, 
            [-10, 10], 
            [10, -10]
          ) 
        },
        { 
          translateY: interpolate(
            rotateX.value, 
            [-10, 10], 
            [10, -10]
          ) 
        },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Animated background elements */}
      <Animated.View style={[styles.backgroundCircle, backgroundAnimatedStyle, { backgroundColor: screen.color }]} />
      <Animated.View style={[styles.backgroundSquare, backgroundAnimatedStyle, { borderColor: screen.color }]} />
      <Animated.View style={[styles.backgroundHexagon, backgroundAnimatedStyle, { borderColor: screen.color }]} />

      <View style={styles.content}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {onboardingScreens.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.progressDot, 
                index === currentScreen && [styles.activeProgressDot, { backgroundColor: screen.color }],
                index < currentScreen && [styles.completedProgressDot, { backgroundColor: screen.color }]
              ]} 
            />
          ))}
        </View>

        {/* Lottie Animation */}
        <Animated.View style={[styles.animationContainer, lottieAnimatedStyle]}>
          <LottieView
            ref={lottieRefs[currentScreen]}
            source={screen.animation}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </Animated.View>

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View style={[styles.card, cardAnimatedStyle, { shadowColor: screen.color }]}>
            <View style={[styles.cardFront, { borderColor: screen.color }]}>
              <Text style={[styles.cardTitle, { color: screen.color }]}>{screen.title}</Text>
              
              <View style={[styles.codeContainer, { borderColor: screen.color }]}>
                <Text style={[styles.codeText, { color: screen.color }]}>{screen.code}</Text>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>

        {/* Description with animation */}
        <Animated.View style={[styles.descriptionContainer, { opacity: descriptionOpacity.value }]}>
          <Text style={styles.cardDescription}>{screen.description}</Text>
        </Animated.View>

        {/* Interactive terminal */}
        <View style={[styles.terminalWindow, { borderColor: screen.color }]}>
          <View style={styles.terminalHeader}>
            <View style={styles.terminalButtons}>
              <View style={[styles.terminalButton, styles.closeButton]} />
              <View style={[styles.terminalButton, styles.minimizeButton]} />
              <View style={[styles.terminalButton, styles.expandButton]} />
            </View>
            <Text style={styles.terminalTitle}>terminal</Text>
          </View>
          <View style={styles.terminalBody}>
            <Text style={[styles.terminalOutput, { color: screen.color }]}>
              {screen.animationText}
            </Text>
            <View style={styles.commandLine}>
              <Text style={styles.prompt}>$ </Text>
              <View style={[styles.cursor, { backgroundColor: screen.color }]} />
            </View>
          </View>
        </View>

        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
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
    </GestureHandlerRootView>
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
    marginBottom: 20,
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
    transform: [{ scale: 1.4 }],
  },
  completedProgressDot: {
    // Color is set dynamically
  },
  animationContainer: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: 'transparent',
    backfaceVisibility: 'hidden',
    marginBottom: 25,
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
    textAlign: 'center',
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
    // Background color is set dynamically
  },
  buttonText: {
    color: '#0a0e17',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OnboardingScreen;
