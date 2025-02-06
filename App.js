// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import SplashScreen from './components/Splash/SplashScreen';
import RoleSelectionScreen from './auth/RoleSelectionScreen';
import LoginScreen from './auth/LoginScreen';
import SignupScreen from './auth/SignupScreen';
import ForgotPasswordScreen from './auth/ForgotPasswordScreen';
import AdminDrawer from './screens/admin/AdminDrawer';
// Import the new employee drawer screen
import EmployeeDrawer from './screens/employee/EmployeeDrawer';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RoleSelection"
              component={RoleSelectionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminDrawer"
              component={AdminDrawer}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="EmployeeDrawer"
              component={EmployeeDrawer}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
