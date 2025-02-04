// auth/RoleSelectionScreen.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from 'react-native-paper';

export default function RoleSelectionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Login Role</Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Login', { role: 'employee' })}
        >
          Employee Login
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Login', { role: 'admin' })}
        >
          Admin Login
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginVertical: 10,
  },
});
