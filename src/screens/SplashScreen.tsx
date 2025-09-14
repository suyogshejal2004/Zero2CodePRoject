import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
  Image
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  // Animation values
  const scaleValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(0)).current;
  const matrixAnim = useRef(new Animated.Value(0)).current;
  const terminalCursorAnim = useRef(new Animated.Value(0)).current;

  // Matrix code rain columns
  const columns = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      x: (width / 15) * i,
      speed: Math.random() * 3 + 1,
      length: Math.floor(Math.random() * 10) + 5,
      start: Math.floor(Math.random() * -100) - 10
    }))
  ).current;

  // Code snippets for terminal
  const codeSnippets = [
    "function learnToCode() {\n  return 'Success!';",
    "const codingApp = {\n  easyToUse: true,\n  effective: true\n};",
    "if (splashScreen.impressive) {\n  launchApp();\n}",
    "class CodeMaster {\n  constructor() {\n    this.awesome = true;\n  }\n}"
  ];

  const [currentSnippet, setCurrentSnippet] = React.useState(0);

  useEffect(() => {
    // Start animations
    startAnimations();

    // Cycle through code snippets
    const snippetInterval = setInterval(() => {
      setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
    }, 2000);

    return () => clearInterval(snippetInterval);
  }, []);

  const startAnimations = () => {
    // Scale animation for the logo
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.elastic(1.2),
      useNativeDriver: true,
    }).start();

    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Fade in text
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1200,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // Bouncing animation for the tagline
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Matrix animation
    Animated.loop(
      Animated.timing(matrixAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Terminal cursor animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(terminalCursorAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(terminalCursorAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Navigate after animation completes
    setTimeout(() => {
    //   onAnimationComplete();
    }, 4000);
  };

  // Interpolate rotation
  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Interpolate bounce
  const bounceInterpolation = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  // Create 3D effect using rotation and scaling
  const frontStyle = {
    transform: [
      { scale: 1.2 },
      { rotateY: '0deg' }
    ]
  };
  
  const backStyle = {
    transform: [
      { scale: 0.9 },
      { rotateY: '180deg' }
    ]
  };
  
  const rightStyle = {
    transform: [
      { scale: 0.95 },
      { rotateY: '90deg' }
    ]
  };
  
  const leftStyle = {
    transform: [
      { scale: 0.95 },
      { rotateY: '-90deg' }
    ]
  };
  
  const topStyle = {
    transform: [
      { scale: 0.85 },
      { rotateX: '90deg' }
    ]
  };
  
  const bottomStyle = {
    transform: [
      { scale: 0.85 },
      { rotateX: '-90deg' }
    ]
  };

  // Matrix code characters
  const getMatrixChar = () => {
    const chars = '01abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$%&^*()';
    return chars[Math.floor(Math.random() * chars.length)];
  };

  return (
    <View style={styles.container}>
      {/* Matrix code rain background */}
      <View style={styles.matrixContainer}>
        {columns.map((col, colIndex) => (
          <View key={colIndex} style={[styles.matrixColumn, { left: col.x }]}>
            {Array.from({ length: col.length }).map((_, rowIndex) => {
              const translateY = matrixAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [col.start, height + 100]
              });
              
              const opacity = matrixAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [rowIndex / col.length, 0]
              });
              
              return (
                <Animated.Text
                  key={rowIndex}
                  style={[
                    styles.matrixChar,
                    {
                      opacity,
                      transform: [{ translateY }],
                      color: rowIndex === 0 ? '#64ffda' : '#00ff00',
                      fontSize: rowIndex === 0 ? 18 : 14,
                      fontWeight: rowIndex === 0 ? 'bold' : 'normal'
                    }
                  ]}
                >
                  {getMatrixChar()}
                </Animated.Text>
              );
            })}
          </View>
        ))}
      </View>
      
      {/* Dark overlay */}
      <View style={styles.overlay} />
      
      {/* Main content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: scaleValue },
                { rotateY: rotateInterpolation },
                { perspective: 1000 }
              ],
            },
          ]}
        >
          <View style={styles.cube}>
            <Animated.View style={[styles.face, styles.front, frontStyle]}>
              <Text style={styles.codeSymbol}>&lt;/&gt;</Text>
            </Animated.View>
            <Animated.View style={[styles.face, styles.back, backStyle]}>
              <Text style={styles.codeSymbol}>{`{}`}</Text>
            </Animated.View>
            <Animated.View style={[styles.face, styles.top, topStyle]} />
            <Animated.View style={[styles.face, styles.bottom, bottomStyle]} />
            <Animated.View style={[styles.face, styles.left, leftStyle]}>
              <Text style={styles.codeSymbol}>();</Text>
            </Animated.View>
            <Animated.View style={[styles.face, styles.right, rightStyle]}>
              <Text style={styles.codeSymbol}>[]</Text>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeValue,
              transform: [{ translateY: bounceInterpolation }],
            },
          ]}
        >
          <Text style={styles.appName}>CODEMASTER</Text>
          <Text style={styles.tagline}>Learn to code like a pro</Text>
        </Animated.View>

        {/* Terminal window */}
        <Animated.View style={[styles.terminal, { opacity: fadeValue }]}>
          <View style={styles.terminalHeader}>
            <View style={styles.terminalButtons}>
              <View style={[styles.terminalButton, styles.closeButton]} />
              <View style={[styles.terminalButton, styles.minimizeButton]} />
              <View style={[styles.terminalButton, styles.expandButton]} />
            </View>
            <Text style={styles.terminalTitle}>bash — 80×30</Text>
          </View>
          <View style={styles.terminalBody}>
            <Text style={styles.terminalText}>
              {codeSnippets[currentSnippet]}
            </Text>
            <Animated.View style={[
              styles.cursor, 
              { opacity: terminalCursorAnim }
            ]} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.loadingContainer, { opacity: fadeValue }]}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { 
              width: scaleValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) 
            }]} />
          </View>
          <Text style={styles.loadingText}>Initializing coding environment...</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  matrixContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    opacity: 0.4,
  },
  matrixColumn: {
    position: 'absolute',
    alignItems: 'center',
  },
  matrixChar: {
    fontSize: 14,
    marginVertical: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 10, 20, 0.85)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 40,
  },
  cube: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  face: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: 'rgba(10, 20, 40, 0.95)',
    borderWidth: 1,
    borderColor: '#64ffda',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
  front: {
    backgroundColor: 'rgba(15, 30, 60, 0.95)',
  },
  back: {
    backgroundColor: 'rgba(20, 40, 80, 0.95)',
  },
  top: {
    backgroundColor: 'rgba(10, 25, 50, 0.85)',
  },
  bottom: {
    backgroundColor: 'rgba(5, 15, 30, 0.85)',
  },
  left: {
    backgroundColor: 'rgba(15, 35, 70, 0.9)',
  },
  right: {
    backgroundColor: 'rgba(10, 25, 50, 0.9)',
  },
  codeSymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64ffda',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#64ffda',
    marginBottom: 8,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#00ffaa',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  terminal: {
    width: width * 0.8,
    backgroundColor: 'rgba(10, 20, 30, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#64ffda',
    overflow: 'hidden',
    marginBottom: 30,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(15, 30, 45, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#64ffda',
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
  },
  terminalBody: {
    padding: 12,
    minHeight: 80,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  terminalText: {
    color: '#00ffaa',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  cursor: {
    width: 8,
    height: 16,
    backgroundColor: '#64ffda',
    marginLeft: 2,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    width: 250,
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#64ffda',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 12,
    color: 'rgba(100, 255, 218, 0.8)',
    fontFamily: 'monospace',
  },
});

export default SplashScreen;