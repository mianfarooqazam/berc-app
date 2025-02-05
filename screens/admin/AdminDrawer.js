// screens/admin/AdminDrawer.js
import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRoute, useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import AdminDrawerContent from './AdminDrawerContent';
import AdminDashboard from './AdminDashboard';
import AdminProfileScreen from './AdminProfileScreen';
// import AssignTaskScreen from './AssignTaskScreen';

const Drawer = createDrawerNavigator();

export default function AdminDrawer() {
  const route = useRoute();
  const navigation = useNavigation();
  // Retrieve the email passed from LoginScreen; fallback to a dummy email if none is provided.
  const { email } = route.params || { email: 'admin@example.com' };

  // Listen for auth state changes. If the user logs out, reset to RoleSelection.
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
        <AdminDrawerContent {...props} email={email} designation="Director" />
      )}
      // Disable swipe gestures so the user cannot swipe to open the drawer after logout.
      screenOptions={{ headerShown: false, swipeEnabled: false }}
    >
      <Drawer.Screen
        name="Home"
        component={AdminDashboard}
        initialParams={{ email }}
      />
      <Drawer.Screen
        name="MyProfile"
        component={AdminProfileScreen}
        initialParams={{ email }}
      />
      {/*
      <Drawer.Screen
        name="AssignTask"
        component={AssignTaskScreen}
        initialParams={{ email }}
      /> */}
    </Drawer.Navigator>
  );
}
