// screens/admin/AdminProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Admin Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
