// screens/employee/EmployeeProfileScreen.js
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, TouchableRipple } from 'react-native-paper';
import AppHeader from '../../components/Header/AppHeader';
import Toast from 'react-native-toast-message';
import { 
  updatePassword, 
  signOut, 
  EmailAuthProvider, 
  reauthenticateWithCredential 
} from 'firebase/auth';
import { auth } from '../../firebase'; // Adjust the path as needed

export default function EmployeeProfileScreen({ navigation, route }) {
  const { email } = route.params || {};

  // States for verification and password update
  const [isVerified, setIsVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Handler to verify the current password using Firebase reauthentication
  const handleVerifyPassword = async () => {
    if (!currentPassword) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your current password',
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'No user is currently signed in',
      });
      return;
    }

    setVerifyLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      Toast.show({
        type: 'success',
        text1: 'Password verified',
      });
      setIsVerified(true);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Incorrect current password',
        text2: error.message,
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  // Handler to update the password in Firebase after verification
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in both password fields',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'No user is currently signed in',
      });
      return;
    }

    setUpdateLoading(true);
    try {
      await updatePassword(user, newPassword);
      Toast.show({
        type: 'success',
        text1: 'Password updated successfully',
      });
      // Optionally sign out the user after password change
      await signOut(auth);
      // Redirect to the RoleSelectionScreen
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelection' }],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating password',
        text2: error.message,
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="My Profile"
        onMenuPress={() => navigation.toggleDrawer()}
        onNotificationPress={() => {
          console.log('Notification pressed');
        }}
      />

      <View style={styles.content}>
        

        {/* Show the current password input until verified */}
        {!isVerified && (
          <>
            <Text style={styles.subHeading}>Verify Current Password</Text>
            <TextInput
              mode="outlined"
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />
            <TouchableRipple
              style={styles.button}
              onPress={handleVerifyPassword}
              rippleColor="rgba(0, 0, 0, 0.1)"
              disabled={verifyLoading}
            >
              <Text style={styles.buttonText}>
                {verifyLoading ? 'Verifying...' : 'Verify Password'}
              </Text>
            </TouchableRipple>
          </>
        )}

        {/* Once verified, display the new password fields */}
        {isVerified && (
          <>
            <Text style={styles.subHeading}>Change Password</Text>
            <TextInput
              mode="outlined"
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />
            <TouchableRipple
              style={styles.button}
              onPress={handleChangePassword}
              rippleColor="rgba(0, 0, 0, 0.1)"
              disabled={updateLoading}
            >
              <Text style={styles.buttonText}>
                {updateLoading ? 'Updating...' : 'Update Password'}
              </Text>
            </TouchableRipple>
          </>
        )}
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
    width: '100%',
  },
  heading: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20,
  },
  text: { 
    fontSize: 18,
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#f8f8ff',
  },
  button: {
    marginTop: 20,
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
