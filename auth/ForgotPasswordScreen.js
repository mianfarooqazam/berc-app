// auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { StyleSheet, Image, View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, TouchableRipple, Text } from 'react-native-paper';
import { ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const onResetPassword = () => {
    console.log('Resetting password for:', email);
    // Implement your password reset logic here
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
          {/* Header with back button in white square box */}
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
          <Text style={styles.title}>Forgot Password</Text>

          {/* Email input with background #f8f8ff */}
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

          {/* Instruction */}
          <Text style={styles.instruction}>
            You will get Verification Code on your Email
          </Text>

          {/* Reset Password button */}
          <TouchableRipple
            style={styles.button}
            onPress={onResetPassword}
            rippleColor="rgba(0, 0, 0, 0.1)"
          >
            <Text style={styles.buttonText}>Reset Password</Text>
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
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#f8f8ff',
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,  
    marginBottom: 20,
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
});
