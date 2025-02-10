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
  const [employeeName, setEmployeeName] = useState('');

  // Fetch employee data from Firestore to get the user's name.
  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        const q = query(
          collection(db, 'employees'),
          where('employee_email', '==', email)
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
  }, [email]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Shared App Header */}
      <AppHeader
        title="Home"
        onMenuPress={() => navigation.toggleDrawer()}
        onNotificationPress={() => console.log('Notification pressed')}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome, {employeeName || 'Employee'}
        </Text>

        {/* Full-width card for Total Tasks Assigned */}
        <Card style={[styles.taskCardFull, { backgroundColor: '#1e90ff' }]}>
          <Card.Content>
            <Title style={styles.taskCardTitle}>
              Total Tasks Assigned: 50
            </Title>
          </Card.Content>
        </Card>

        {/* Row of two cards for Completed and Pending Tasks */}
        <View style={styles.cardsRow}>
          <Card style={[styles.taskCardHalf, { backgroundColor: '#97d43b' }]}>
            <Card.Content>
              <Title style={styles.taskCardTitle}>Completed</Title>
              <Paragraph style={styles.taskCardValue}>30</Paragraph>
            </Card.Content>
          </Card>
          <Card style={[styles.taskCardHalf, { backgroundColor: '#ff9100' }]}>
            <Card.Content>
              <Title style={styles.taskCardTitle}>Pending</Title>
              <Paragraph style={styles.taskCardValue}>20</Paragraph>
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
    backgroundColor: '#f8f8ff',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
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
