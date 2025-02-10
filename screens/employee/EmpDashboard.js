import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import AppHeader from '../../components/Header/AppHeader';

export default function EmpDashboard({ navigation, route }) {
  // Extract email from route params with a fallback value.
  const { email } = route.params || { email: 'employee@example.com' };
  const currentEmail = email || 'employee@example.com';
  const [employeeName, setEmployeeName] = useState('');

  // Fetch employee data from Firestore to get the user's name.
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
          setEmployeeName('Employee');
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setEmployeeName('Employee');
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
          {employeeName || 'Employee'}
        </Text>

        {/* Full-width card for Total Tasks Assigned */}
        <Card style={[styles.taskCardFull, { backgroundColor: '#1e90ff' }]}>
          <Card.Content>
            <Title style={styles.taskCardTitle}>
              Total Tasks Assigned: 120
            </Title>
          </Card.Content>
        </Card>

        {/* Row of two cards for Completed Tasks and Pending Tasks */}
        <View style={styles.cardsRow}>
          <Card style={[styles.taskCardHalf, { backgroundColor: '#97d43b' }]}>
            <Card.Content>
              <Title style={styles.taskCardTitle}>Completed</Title>
              <Paragraph style={styles.taskCardValue}>80</Paragraph>
            </Card.Content>
          </Card>
          <Card style={[styles.taskCardHalf, { backgroundColor: '#ff9100' }]}>
            <Card.Content>
              <Title style={styles.taskCardTitle}>Pending</Title>
              <Paragraph style={styles.taskCardValue}>40</Paragraph>
            </Card.Content>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF1FB', // same as AdminDashboard
    padding: 20,
  },
  content: {
    alignItems: 'flex-start', // left align all content
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
    fontWeight: 'bold', // bold for employee name
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
    justifyContent: 'space-between',
    width: '100%',
  },
  taskCardHalf: {
    width: '45%',
    borderRadius: 8,
  },
  taskCardTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  taskCardValue: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
});
