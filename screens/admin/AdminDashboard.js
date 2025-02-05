import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableRipple } from 'react-native-paper';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase'; // adjust the path as needed
import AppHeader from '../../components/Header/AppHeader'; // import the reusable header

export default function AdminDashboard({ navigation, route }) {
  const { email } = route.params || { email: 'admin@example.com' };

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
        <Text style={styles.welcomeText}>Welcome, Admin!</Text>
        <Text style={styles.emailText}>Email: {email}</Text>
      </View>

      {/*
      Uncomment if you want a logout button here as well
      <TouchableRipple style={styles.logoutButton} onPress={onLogout} rippleColor="rgba(0,0,0,0.1)">
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableRipple>
      */}
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
  emailText: {
    fontSize: 18,
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
