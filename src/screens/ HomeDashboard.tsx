import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
  StatusBar,
  SafeAreaView,
  Easing,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from '@react-native-community/blur';

const { width, height } = Dimensions.get('window');

// Sample courses with more details
const courses = [
  { 
    id: '1', 
    title: 'JavaScript Basics', 
    description: 'Learn JS fundamentals', 
    color: '#FFDD59',
    icon: 'code',
    progress: 0.65,
    duration: '12 hours',
    level: 'Beginner',
    popularity: 4.8,
    students: 1245
  },
  { 
    id: '2', 
    title: 'ReactJS', 
    description: 'Build interactive UIs', 
    color: '#64ffda',
    icon: 'developer-mode',
    progress: 0.3,
    duration: '18 hours',
    level: 'Intermediate',
    popularity: 4.9,
    students: 2897
  },
  { 
    id: '3', 
    title: 'Python Programming', 
    description: 'Automate tasks and data', 
    color: '#FF6B6B',
    icon: 'data-usage',
    progress: 0.8,
    duration: '15 hours',
    level: 'Beginner',
    popularity: 4.7,
    students: 3156
  },
  { 
    id: '4', 
    title: 'Node.js', 
    description: 'Backend with JS', 
    color: '#1E90FF',
    icon: 'storage',
    progress: 0.2,
    duration: '20 hours',
    level: 'Advanced',
    popularity: 4.8,
    students: 1987
  },
  { 
    id: '5', 
    title: 'Flutter', 
    description: 'Cross-platform mobile apps', 
    color: '#FF9F1C',
    icon: 'phone-iphone',
    progress: 0.5,
    duration: '14 hours',
    level: 'Intermediate',
    popularity: 4.6,
    students: 1654
  },
];

// Featured courses
const featuredCourses = [
  { 
    id: 'f1', 
    title: 'AI & Machine Learning', 
    description: 'Master the fundamentals of AI', 
    color: '#9C27B0',
    icon: 'psychology',
    image: require('/Users/suyog/ReactNative/Zero2Code/src/asset/images.png'), // You would add these images
  },
  { 
    id: 'f2', 
    title: 'Web Development Pro', 
    description: 'Full-stack development course', 
    color: '#2196F3',
    icon: 'web',
 image: require('/Users/suyog/ReactNative/Zero2Code/src/asset/images.png'), // 
  },
];

// User data
const userData = {
  name: 'Alex Johnson',
  streak: 12,
  points: 2450,
  avatar:  require('/Users/suyog/ReactNative/Zero2Code/src/asset/images.png'), // You would add this image
};

// Animation data
const DashboardAnimation = require('../asset/Command Prompt.json');

const HomeDashboard = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const lottieRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('');

  // Parallax effects
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [280, 100],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const heroScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  // Set time of day greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
  }, []);

  useEffect(() => {
    const fadeAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });

    const scaleAnimation = Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: Platform.OS !== 'web',
    });

    const translateYAnimation = Animated.timing(translateYAnim, {
      toValue: 0,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });

    Animated.parallel([fadeAnimation, scaleAnimation, translateYAnimation]).start();

    return () => {
      fadeAnimation.stop();
      scaleAnimation.stop();
      translateYAnimation.stop();
    };
  }, [fadeAnim, scaleAnim, translateYAnim]);

  useEffect(() => {
    if (lottieRef.current) {
      setTimeout(() => lottieRef.current.play(), 500);
    }
    return () => {
      if (lottieRef.current) {
        lottieRef.current.reset();
      }
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const renderCourseCard = useCallback(({ item, index }) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.97,
        friction: 6,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    };

    return (
      <Animated.View 
        style={[
          styles.cardContainer, 
          { 
            transform: [{ scale }],
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.courseCard, { borderLeftColor: item.color }]}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => navigation.navigate('CourseDetails', { course: item })}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Icon name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.courseMeta}>
              <Text style={[styles.courseLevel, { color: item.color }]}>{item.level}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={14} color={item.color} />
                <Text style={[styles.ratingText, { color: item.color }]}>{item.popularity}</Text>
              </View>
            </View>
          </View>
          
          <Text style={[styles.courseTitle, { color: '#fff' }]}>{item.title}</Text>
          <Text style={styles.courseDescription}>{item.description}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${item.progress * 100}%`,
                    backgroundColor: item.color
                  }
                ]} 
              />
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>{Math.round(item.progress * 100)}% Complete</Text>
              <Text style={styles.studentsText}>{item.students.toLocaleString()} students</Text>
            </View>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.durationContainer}>
              <Icon name="access-time" size={14} color="#8890A6" />
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate('CoursePlayer', { course: item })}
            >
              <Text style={styles.continueText}>
                {item.progress > 0 ? 'Continue' : 'Start'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [fadeAnim, navigation]);

  const renderFeaturedCard = ({ item, index }) => {
    const scale = new Animated.Value(1);
    
    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.98,
        friction: 7,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    };

    return (
      <Animated.View style={[styles.featuredCardContainer, { transform: [{ scale }] }]}>
        <TouchableOpacity
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => navigation.navigate('CourseDetails', { course: item })}
          activeOpacity={0.9}
        >
          <ImageBackground 
            source={item.image} 
            style={styles.featuredCard}
            imageStyle={styles.featuredCardImage}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.featuredGradient}
            >
              <View style={[styles.featuredIcon, { backgroundColor: item.color + '40' }]}>
                <Icon name={item.icon} size={28} color="#fff" />
              </View>
              <Text style={styles.featuredTitle}>{item.title}</Text>
              <Text style={styles.featuredDescription}>{item.description}</Text>
              <View style={styles.featuredButton}>
                <Text style={styles.featuredButtonText}>Explore Now</Text>
                <Icon name="arrow-forward" size={16} color="#fff" />
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        activeCategory === item.id && { backgroundColor: '#64ffda20', borderColor: '#64ffda' }
      ]}
      onPress={() => setActiveCategory(item.id)}
    >
      <Icon 
        name={item.icon} 
        size={16} 
        color={activeCategory === item.id ? '#64ffda' : '#8890A6'} 
        style={styles.categoryIcon}
      />
      <Text style={[
        styles.categoryText,
        activeCategory === item.id && { color: '#64ffda' }
      ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const categories = [
    { id: 'all', title: 'All Courses', icon: 'dashboard' },
    { id: 'in-progress', title: 'In Progress', icon: 'play-circle' },
    { id: 'new', title: 'New', icon: 'fiber-new' },
    { id: 'completed', title: 'Completed', icon: 'check-circle' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient 
        colors={['#0a0e17', '#1a1a3a', '#0a0e17']} 
        style={styles.container}
        locations={[0, 0.5, 1]}
      >
        <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
          <Animated.View style={[styles.headerBackground, { transform: [{ scale: heroScale }] }]} />
          
          <View style={styles.userInfo}>
            <View>
              <Text style={styles.greeting}>Good {timeOfDay},</Text>
              <Text style={styles.userName}>{userData.name}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <ImageBackground 
                source={userData.avatar} 
                style={styles.avatar}
                imageStyle={styles.avatarImage}
              >
                <View style={styles.statusIndicator} />
              </ImageBackground>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#64ffda20' }]}>
                <Icon name="local-fire-department" size={20} color="#64ffda" />
              </View>
              <View>
                <Text style={styles.statValue}>{userData.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FF6B6B20' }]}>
                <Icon name="emoji-events" size={20} color="#FF6B6B" />
              </View>
              <View>
                <Text style={styles.statValue}>{userData.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#1E90FF20' }]}>
                <Icon name="menu-book" size={20} color="#1E90FF" />
              </View>
              <View>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.FlatList
          ListHeaderComponent={
            <Animated.View
              style={[
                styles.listHeader,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: translateYAnim }],
                },
              ]}
            >
              <View style={styles.searchContainer}>
                <TouchableOpacity style={styles.searchBar}>
                  <Icon name="search" size={22} color="#8890A6" />
                  <Text style={styles.searchText}>Search courses, topics...</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                  <Icon name="tune" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Courses</Text>
                <FlatList
                  data={featuredCourses}
                  renderItem={renderFeaturedCard}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredList}
                />
              </View>
              
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Continue Learning</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={categories}
                  renderItem={renderCategoryChip}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesContainer}
                />
              </View>
            </Animated.View>
          }
          data={courses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#64ffda"
              colors={['#64ffda']}
            />
          }
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 58, 0.7)',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    zIndex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#8890A6',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  avatarImage: {
    borderRadius: 25,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#0a0e17',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 16,
    zIndex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#8890A6',
  },
  listContainer: {
    paddingBottom: 100,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchText: {
    color: '#8890A6',
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(100, 255, 218, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllText: {
    fontSize: 14,
    color: '#64ffda',
    fontWeight: '600',
  },
  featuredList: {
    paddingBottom: 10,
  },
  featuredCardContainer: {
    width: width * 0.8,
    marginRight: 15,
    height: 200,
  },
  featuredCard: {
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredCardImage: {
    borderRadius: 20,
  },
  featuredGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  featuredIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  featuredDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
  },
  featuredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  featuredButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 5,
  },
  categoriesContainer: {
    paddingBottom: 15,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    color: '#8890A6',
    fontSize: 14,
    fontWeight: '500',
  },
  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  courseCard: {
    backgroundColor: 'rgba(18, 25, 42, 0.9)',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseMeta: {
    alignItems: 'flex-end',
  },
  courseLevel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#8890A6',
    marginBottom: 15,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: '#8890A6',
  },
  studentsText: {
    fontSize: 12,
    color: '#8890A6',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#8890A6',
    marginLeft: 5,
  },
  continueButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  continueText: {
    color: '#0a0e17',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HomeDashboard;