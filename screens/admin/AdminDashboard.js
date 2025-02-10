import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase'; // adjust the path as needed
import AppHeader from '../../components/Header/AppHeader';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Create an Animated version of the Card component
const AnimatedCard = Animated.createAnimatedComponent(Card);

export default function AdminDashboard({ navigation, route }) {
  // Extract email from route params with a fallback value.
  const { email } = route.params || { email: 'admin@example.com' };
  const currentEmail = email || 'admin@example.com';
  const [employeeName, setEmployeeName] = useState('');

  // Animation values for each card
  const completedScale = useRef(new Animated.Value(1)).current;
  const pendingScale = useRef(new Animated.Value(1)).current;

  // Animation helper functions
  const handlePressIn = (animatedValue) => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (animatedValue) => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  // Protect the route using auth state listener (optional)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'RoleSelection' }],
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  // Fetch employee data to get the user's name
  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        const q = query(
          collection(db, 'employees'),
          where('employee_email', '==', currentEmail)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data();
          setEmployeeName(employeeData.name);
        } else {
          // Fallback to "Admin" if no matching document is found
          setEmployeeName('Admin');
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setEmployeeName('Admin');
      }
    }
    fetchEmployeeData();
  }, [currentEmail]);

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Reusable Header */}
      <AppHeader
        title="Home"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.employeeNameText}>
          {employeeName || 'Admin'}
        </Text>

        {/* Full-width card for Total Tasks Assigned */}
        <Card style={[styles.taskCardFull, { backgroundColor: '#1e90ff' }]}>
          <Card.Content>
            <Title style={styles.taskCardTitle}>Total Tasks Assigned: 120</Title>
          </Card.Content>
        </Card>

        {/* Row of two animated cards for Completed Tasks and Pending Tasks */}
        <View style={styles.cardsRow}>
          <View style={[styles.cardContainer, { marginRight: 10 }]}>
            <AnimatedCard
              onPressIn={() => handlePressIn(completedScale)}
              onPressOut={() => handlePressOut(completedScale)}
              onPress={() =>
                navigation.navigate('TaskStatus', { status: 'completed' })
              }
              style={[
                { transform: [{ scale: completedScale }] },
                styles.taskCardHalf,
                { backgroundColor: '#97d43b' },
              ]}
            >
              <Card.Content>
                <Title style={styles.taskCardTitleBlack}>Completed Tasks</Title>
                <Paragraph style={styles.taskCardValueBlack}>80</Paragraph>
              </Card.Content>
            </AnimatedCard>
          </View>
          <View style={styles.cardContainer}>
            <AnimatedCard
              onPressIn={() => handlePressIn(pendingScale)}
              onPressOut={() => handlePressOut(pendingScale)}
              onPress={() =>
                navigation.navigate('TaskStatus', { status: 'pending' })
              }
              style={[
                { transform: [{ scale: pendingScale }] },
                styles.taskCardHalf,
                { backgroundColor: '#ff9100' },
              ]}
            >
              <Card.Content>
                <Title style={styles.taskCardTitleBlack}>Pending Tasks</Title>
                <Paragraph style={styles.taskCardValueBlack}>40</Paragraph>
              </Card.Content>
            </AnimatedCard>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF1FB',
    padding: 20,
  },
  content: {
    alignItems: 'flex-start',
    marginTop: 40,
    width: '100%',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '300', // light font weight for "Welcome!"
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  employeeNameText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
  },
  taskCardFull: {
    width: '100%',
    borderRadius: 8,
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  cardContainer: {
    flex: 1,
  },
  taskCardHalf: {
    borderRadius: 8,
  },
  taskCardTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  taskCardTitleBlack: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
    marginVertical: 0,
  },
  taskCardValueBlack: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'left',
    marginTop: 2,
    fontWeight: 'normal',
  },
});
