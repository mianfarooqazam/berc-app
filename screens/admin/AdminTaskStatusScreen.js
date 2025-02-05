import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/Header/AppHeader'; // adjust the path as needed

export default function AdminTaskStatusScreen({ navigation }) {
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
        title="Tasks Status"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
      />
      {/* Screen Content */}
      <View style={styles.content}>
        <Text>Admin Task Status Screen</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
    padding: 20, // Same padding as AdminDashboard
  },
  content: {
    alignItems: 'center',
    marginTop: 40, // Same margin as AdminDashboard
  },
});
