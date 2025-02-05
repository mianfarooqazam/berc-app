// screens/admin/AdminDrawerContent.js
import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer, Text, Divider } from 'react-native-paper';
import { Home, User, Clipboard, LogOut } from 'lucide-react-native';

export default function AdminDrawerContent({ navigation, email, designation }) {
  const [active, setActive] = useState('home');

  // Use the provided email and designation (with fallback values if necessary)
  const currentEmail = email || 'admin@example.com';
  const currentDesignation = designation || 'Director';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/berc-logo.jpeg')}
            style={styles.logo}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={require('../../assets/profile.webp')} // update this with your profile image path
            style={styles.profilePicture}
          />
          <Text style={styles.email}>{currentEmail}</Text>
          <Text style={styles.designation}>{currentDesignation}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Drawer Items */}
        <Drawer.Section style={styles.drawerSection}>
          <Drawer.Item
            label="Home"
            icon={({ size, color }) => <Home size={size} color={color} />}
            active={active === 'home'}
            onPress={() => {
              setActive('home');
              navigation.navigate('Home');
            }}
          />
          <Drawer.Item
            label="My Profile"
            icon={({ size, color }) => <User size={size} color={color} />}
            active={active === 'profile'}
            onPress={() => {
              setActive('profile');
              navigation.navigate('MyProfile');
            }}
          />
          <Drawer.Item
            label="Assign Task"
            icon={({ size, color }) => <Clipboard size={size} color={color} />}
            active={active === 'assign'}
            onPress={() => {
              setActive('assign');
              navigation.navigate('AssignTask');
            }}
          />
        </Drawer.Section>

        {/* Logout Section */}
        <Drawer.Section style={styles.bottomDrawerSection}>
        <Drawer.Item
  label="Logout"
  icon={({ size, color }) => <LogOut size={size} color={color} />}
  onPress={() => {
    // Here you can also perform signOut logic if desired.
    navigation.reset({
      index: 0,
      routes: [{ name: 'RoleSelection' }],
    });
  }}
/>

        </Drawer.Section>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  divider: {
    marginVertical: 10,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  designation: {
    fontSize: 14,
    color: '#888',
  },
  drawerSection: {
    marginTop: 10,
  },
  bottomDrawerSection: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f4f4f4',
  },
});
