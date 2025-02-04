// auth/SignupScreen.js
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text } from 'react-native-paper';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSignup = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log('Signing up as employee with:', email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Employee Sign Up</Text>
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
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={onSignup} style={styles.button}>
        Sign Up
      </Button>
      <Button onPress={() => navigation.goBack()}>
        Already have an account? Login
      </Button>
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
