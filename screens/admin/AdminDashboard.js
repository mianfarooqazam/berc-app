// screens/admin/AdminDashboard.js
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableRipple } from 'react-native-paper';
import { Menu } from 'lucide-react-native';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase'; // adjust the path as needed

export default function AdminDashboard({ navigation, route }) {
  // Get the email from route params (set via initialParams in AdminDrawer)
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

  const onLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelection' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with drawer icon */}
      <View style={styles.header}>
        <TouchableRipple
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
          rippleColor="rgba(0, 0, 0, 0.1)"
        >
          <Menu size={24} color="#000" />
        </TouchableRipple>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, Admin!</Text>
        <Text style={styles.emailText}>Email: {email}</Text>
      </View>

      {/* (Optional Logout button if you want one in the dashboard as well)
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
