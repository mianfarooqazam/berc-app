import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import {  db } from '../../firebase';
import AppHeader from '../../components/Header/AppHeader';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function EmpDashboard({ navigation, route }) {
  // Expect an email passed via route params; fallback value provided if not present.
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
          // Fallback name if no matching document is found.
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

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome, {employeeName || 'Employee'}
        </Text>
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
  logoutButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#97d43b',
    borderRadius: 4,
    marginTop: 'auto',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});
