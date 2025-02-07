// screens/employee/EmpDashboard.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableRipple } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import AppHeader from '../../components/Header/AppHeader'; 

export default function EmpDashboard({ navigation, route }) {
  const { email } = route.params || {};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Reset navigation stack and send user back to role selection screen.
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelection' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Shared App Header */}
      <AppHeader
        title="Home"
        onMenuPress={() => navigation.toggleDrawer()}
        onNotificationPress={() => {
          // Handle notification press if needed.
          console.log('Notification pressed');
        }}
      />

      <View style={styles.content}>
        <Text style={styles.heading}>Employee Dashboard</Text>
        <Text style={styles.email}>Logged in as: {email}</Text>
        <TouchableRipple
          style={styles.button}
          onPress={handleLogout}
          rippleColor="rgba(0, 0, 0, 0.1)"
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#97d43b',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
