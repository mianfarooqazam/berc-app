// screens/employee/EmployeeDrawerContent.js
import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer, Text, Divider } from 'react-native-paper';
import { Home, Calendar1, User, LogOut } from 'lucide-react-native';

export default function EmployeeDrawerContent({ navigation, email }) {
  const [active, setActive] = useState("home");
  const currentEmail = email || "employee@example.com";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../../assets/profile.webp")} // Replace with your employee profile image path.
            style={styles.profilePicture}
          />
          <Text style={styles.email}>{currentEmail}</Text>
          <Text style={styles.designation}>Employee</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Main Drawer Items */}
        <Drawer.Section style={styles.drawerSection} showDivider={false}>
          <Drawer.Item
            label="Home"
            icon={({ size, color }) => <Home size={size} color={color} />}
            active={active === "home"}
            onPress={() => {
              setActive("home");
              navigation.navigate("Home");
            }}
            style={active === "home" ? { borderRadius: 10 } : null}
          />
          <Drawer.Item
            label="Events"
            icon={({ size, color }) => <Calendar1 size={size} color={color} />}
            active={active === "events"}
            onPress={() => {
              setActive("events");
              navigation.navigate("Events");
            }}
            style={active === "events" ? { borderRadius: 10 } : null}
          />
        </Drawer.Section>

        {/* Bottom Section: My Profile and Logout */}
        <Drawer.Section style={styles.bottomDrawerSection} showDivider={false}>
          <Drawer.Item
            label="My Profile"
            icon={({ size, color }) => <User size={size} color={color} />}
            active={active === "profile"}
            onPress={() => {
              setActive("profile");
              navigation.navigate("MyProfile");
            }}
            style={active === "profile" ? { borderRadius: 10 } : null}
          />
          <Drawer.Item
            label="Logout"
            icon={({ size }) => <LogOut size={size} color={"red"} />}
            onPress={() => {
              // Reset navigation stack back to RoleSelection.
              navigation.reset({
                index: 0,
                routes: [{ name: "RoleSelection" }],
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
  divider: {
    marginVertical: 10,
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 40,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: "bold",
  },
  designation: {
    fontSize: 14,
    color: "#888",
  },
  drawerSection: {
    marginTop: 10,
  },
  bottomDrawerSection: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#f4f4f4",
  },
});
