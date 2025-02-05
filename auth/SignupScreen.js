// auth/SignupScreen.js
import React, { useState } from 'react';
import { StyleSheet, Image, View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, TouchableRipple, Text } from 'react-native-paper';
import { ArrowLeft } from 'lucide-react-native';

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
    // Implement your signup logic here
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableRipple 
              onPress={() => navigation.goBack()}
              rippleColor="rgba(0, 0, 0, 0.1)"
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#000" />
            </TouchableRipple>
          </View>

          {/* Logo */}
          <Image 
            source={require('../assets/berc-logo.jpeg')}
            style={styles.logo}
          />

          {/* Title */}
          <Text style={styles.title}>Employee Sign Up</Text>

          {/* Form inputs with background #f8f8ff */}
          <TextInput
                      mode="outlined"

            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            theme={{ colors: { background: '#f8f8ff' } }}
          />
          <TextInput
                      mode="outlined"

            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            theme={{ colors: { background: '#f8f8ff' } }}
          />
          <TextInput
                      mode="outlined"

            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            theme={{ colors: { background: '#f8f8ff' } }}
          />

          {/* Signup button */}
          <TouchableRipple 
            style={styles.button}
            onPress={onSignup}
            rippleColor="rgba(0, 0, 0, 0.1)"
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableRipple>

          {/* Navigation text to Login */}
          <TouchableRipple 
            onPress={() => navigation.goBack()}
            rippleColor="rgba(0, 0, 0, 0.1)"
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableRipple>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight:'bold'

  },
  input: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#f8f8ff',
  },
  button: {
    marginVertical: 10,
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#97d43b',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginButton: {
    marginTop: 10,
  },
  loginText: {
    color: '#000',
    fontSize: 14,
  },
});
