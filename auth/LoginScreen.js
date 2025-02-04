// auth/LoginScreen.js
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text } from 'react-native-paper';

export default function LoginScreen({ navigation, route }) {
  const { role } = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    console.log(`Logging in as ${role} with:`, email, password);
    // Implement your login logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {role === 'admin' ? 'Admin Login' : 'Employee Login'}
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={onLogin} style={styles.button}>
        Login
      </Button>
      {/* Render signup button only for employees */}
      {role !== 'admin' && (
        <Button onPress={() => navigation.navigate('Signup')}>
          Don't have an account? Sign Up
        </Button>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
});
