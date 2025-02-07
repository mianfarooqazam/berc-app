// screens/employee/EmployeeProfileScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  TextInput,
  TouchableRipple,
  Card,
  Button,
} from 'react-native-paper';
import AppHeader from '../../components/Header/AppHeader';
import Toast from 'react-native-toast-message';
import {
  updatePassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from '../../firebase'; // Adjust the path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function EmployeeProfileScreen({ navigation, route }) {
  const { email } = route.params || {};

  // States for employee info
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeDesignation, setEmployeeDesignation] = useState('');

  // State to control whether to show the password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // States for verification and password update
  const [isVerified, setIsVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch employee data from Firestore based on the email
  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        const q = query(
          collection(db, "employees"),
          where("employee_email", "==", email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setEmployeeName(data.name || '');
          setEmployeeId(data.employee_id || '');
          setEmployeeDesignation(data.designation || 'Employee');
        }
      } catch (error) {
        console.error("Error fetching employee data: ", error);
      }
    }
    if (email) {
      fetchEmployeeData();
    }
  }, [email]);

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
      // Optionally sign out after password change
      await signOut(auth);
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
        onNotificationPress={() => console.log('Notification pressed')}
      />

      <View style={styles.content}>
        {/* Profile Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.profileLabel}>
              Name: <Text style={styles.profileValue}>{employeeName}</Text>
            </Text>
            <Text style={styles.profileLabel}>
              Designation: <Text style={styles.profileValue}>{employeeDesignation}</Text>
            </Text>
            <Text style={styles.profileLabel}>
              Employee ID: <Text style={styles.profileValue}>{employeeId}</Text>
            </Text>
            <Text style={styles.profileLabel}>
              Email: <Text style={styles.profileValue}>{email}</Text>
            </Text>
          </Card.Content>
        </Card>

        {/* Change Password Button */}
        {!showPasswordForm && (
          <Button
            mode="contained"
            onPress={() => setShowPasswordForm(true)}
            style={styles.changePasswordButton}
          >
            Change Password
          </Button>
        )}

        {/* Password Change Form */}
        {showPasswordForm && (
          <View style={styles.passwordForm}>
            {!isVerified ? (
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
            ) : (
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
    padding: 20,
    width: '100%',
  },
  card: {
    backgroundColor: '#f8f8ff',
    marginBottom: 20,
    elevation: 2,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileValue: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666',
  },
  changePasswordButton: {
    marginVertical: 10,
  },
  passwordForm: {
    marginTop: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#fff',
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
    textAlign: 'center',
  },
});
