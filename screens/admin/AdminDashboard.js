import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableRipple } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase'; // adjust the path as needed
import AppHeader from '../../components/Header/AppHeader'; // import the reusable header
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function AdminDashboard({ navigation, route }) {
  // Extract email from route params with a fallback value.
  const { email } = route.params || { email: 'admin@example.com' };
  const currentEmail = email || 'admin@example.com';
  const [employeeName, setEmployeeName] = useState('');

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

  // Example press handlers
  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleNotificationPress = () => {
    // Navigate to a Notifications screen or show a dropdown
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
        <Text style={styles.welcomeText}>
          Welcome, {employeeName || 'Admin'}
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
