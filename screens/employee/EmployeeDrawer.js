// screens/employee/EmployeeDrawer.js
import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRoute, useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import EmployeeDrawerContent from './EmployeeDrawerContent';
import EmpDashboard from './EmpDashboard'; // Your dashboard screen (home)
import EmployeeEventsScreen from './EmployeeEventsScreen';
import EmployeeProfileScreen from './EmployeeProfileScreen';

const Drawer = createDrawerNavigator();

export default function EmployeeDrawer() {
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params || { email: 'employee@example.com' };

  // If the auth state changes (e.g. user logs out), navigate back to RoleSelection.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'RoleSelection' }],
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => (
        <EmployeeDrawerContent {...props} email={email} />
      )}
      screenOptions={{ headerShown: false, swipeEnabled: false }}
    >
      <Drawer.Screen
        name="Home"
        component={EmpDashboard}
        initialParams={{ email }}
      />
      <Drawer.Screen
        name="Events"
        component={EmployeeEventsScreen}
        initialParams={{ email }}
      />
      <Drawer.Screen
        name="MyProfile"
        component={EmployeeProfileScreen}
        initialParams={{ email }}
      />
    </Drawer.Navigator>
  );
}
