// screens/employee/EmployeeEventsScreen.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import AppHeader from '../../components/Header/AppHeader'; // Adjust the import path as needed

export default function EmployeeEventsScreen({ navigation, route }) {
  const { email } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Upcoming Events"
        onMenuPress={() => navigation.toggleDrawer()}
        onNotificationPress={() => {
          // Handle notification press if needed.
          console.log('Notification pressed');
        }}
      />

      <View style={styles.content}>
        <Text style={styles.heading}>Employee Events</Text>
        <Text style={styles.text}>Events content goes here.</Text>
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
    marginBottom: 20 
  },
  text: { 
    fontSize: 18 
  },
});
