// auth/LoginScreen.js
import React, { useState } from 'react';
import { StyleSheet, Image, View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, TouchableRipple, Text, Switch, Snackbar } from 'react-native-paper';
import { ArrowLeft } from 'lucide-react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import the Firebase auth instance

export default function LoginScreen({ navigation, route }) {
  const { role } = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // State for error message

  const onLogin = async () => {
    setLoading(true);
    if (role === 'admin') {
      try {
        // Use Firebase Authentication for admin login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Admin logged in:', user.email);
        // Reset navigation stack so admin drawer becomes the new root.
        navigation.reset({
          index: 0,
          routes: [{ name: 'AdminDrawer', params: { email: user.email } }],
        });
      } catch (error) {
        console.error('Admin login error:', error);
        // Set a toast message on wrong credentials or any error
        setErrorMsg('Invalid credentials. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Implement employee login (and/or signup) logic here if needed
      console.log(`Employee login not implemented in this example.`);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          <Text style={styles.title}>
            {role === 'admin' ? 'Admin Login' : 'Employee Login'}
          </Text>

          {/* Form inputs */}
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

          {role !== 'admin' && (
            <View style={styles.optionsContainer}>
              <View style={styles.rememberContainer}>
                <Switch
                  value={remember}
                  onValueChange={() => setRemember(!remember)}
                  style={styles.switch}
                  color="#97d43b"
                />
                <Text style={styles.rememberText}>Keep me logged in</Text>
              </View>
            </View>
          )}

          {/* Login button */}
          <TouchableRipple
            style={styles.button}
            onPress={onLogin}
            rippleColor="rgba(0, 0, 0, 0.1)"
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableRipple>

          {/* Forgot Password link */}
          <TouchableRipple
            onPress={() => navigation.navigate('ForgotPassword')}
            rippleColor="rgba(0, 0, 0, 0.1)"
            style={styles.forgotContainer}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableRipple>

          {/* Render signup button only for employees */}
          {role !== 'admin' && (
            <TouchableRipple
              onPress={() => navigation.navigate('Signup')}
              rippleColor="rgba(0, 0, 0, 0.1)"
              style={styles.signupButton}
            >
              <Text style={styles.signupText}>Create New Account</Text>
            </TouchableRipple>
          )}
        </ScrollView>

        {/* Snackbar for error messages */}
        <Snackbar
          visible={!!errorMsg}
          onDismiss={() => setErrorMsg('')}
          duration={3000}
          style={{ backgroundColor: 'red' }}
        >
          {errorMsg}
        </Snackbar>
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
    marginBottom: 30,
    fontWeight:'bold'
  },
  input: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#f8f8ff',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 10,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    transform: [{ scale: 0.8 }],
    marginRight: 5,
  },
  rememberText: {
    fontSize: 14,
    color: '#000',
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
  forgotContainer: {
    marginVertical: 10,
  },
  forgotText: {
    fontSize: 14,
    color: '#97d43b',
  },
  signupButton: {
    marginTop: 10,
  },
  signupText: {
    color: '#000',
    fontSize: 14,
  },
});
