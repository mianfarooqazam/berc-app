// App.js - Load screens incrementally
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import SplashScreen from './components/Splash/SplashScreen';
import RoleSelectionScreen from './auth/RoleSelectionScreen';
// Comment out the rest temporarily
// import LoginScreen from './auth/LoginScreen';
// import SignupScreen from './auth/SignupScreen';
// import ForgotPasswordScreen from './auth/ForgotPasswordScreen';
// import AdminDrawer from './screens/admin/AdminDrawer';
// import EmployeeDrawer from './screens/employee/EmployeeDrawer';

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
            {/* Add other screens back one by one */}
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </PaperProvider>
  );
}