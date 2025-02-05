// screens/admin/AdminDrawerContent.js
import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Drawer, Text, Divider } from "react-native-paper";
import { Home, User, Clipboard, Calendar1, Users, LogOut, CircleAlert } from "lucide-react-native";

export default function AdminDrawerContent({ navigation, email, designation }) {
  const [active, setActive] = useState("home");

  // Use the provided email and designation (with fallback values if necessary)
  const currentEmail = email || "admin@example.com";
  const currentDesignation = designation || "Director";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Logo Section removed */}

        {/* Profile Section with added gap */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../../assets/profile.webp")} // update this with your profile image path if needed.
            style={styles.profilePicture}
          />
          <Text style={styles.email}>{currentEmail}</Text>
          <Text style={styles.designation}>{currentDesignation}</Text>
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
            style={active === "home" ? { borderRadius: 10 } : null} // Apply 10px border radius for active item
          />
          <Drawer.Item
            label="Assign Task"
            icon={({ size, color }) => <Clipboard size={size} color={color} />}
            active={active === "assign"}
            onPress={() => {
              setActive("assign");
              navigation.navigate("AssignTask");
            }}
            style={active === "assign" ? { borderRadius: 10 } : null} // Apply 10px border radius for active item
          />
          <Drawer.Item
            label="Tasks Status"
            icon={({ size, color }) => <CircleAlert size={size} color={color} />}
            active={active === "status"}
            onPress={() => {
              setActive("status");
              navigation.navigate("TaskStatus");
            }}
            style={active === "status" ? { borderRadius: 10 } : null} // Apply 10px border radius for active item
          />
          <Drawer.Item
            label="Events"
            icon={({ size, color }) => <Calendar1 size={size} color={color} />}
            active={active === "events"}
            onPress={() => {
              setActive("events");
              navigation.navigate("Events");
            }}
            style={active === "events" ? { borderRadius: 10 } : null} // Apply 10px border radius for active item
          />
          <Drawer.Item
            label="Employees"
            icon={({ size, color }) => <Users size={size} color={color} />}
            active={active === "employee"}
            onPress={() => {
              setActive("employee");
              navigation.navigate("Employee");
            }}
            style={active === "employee" ? { borderRadius: 10 } : null} // Apply 10px border radius for active item
          />

        </Drawer.Section>

        {/* Bottom Section: My Profile moved above Logout */}
        <Drawer.Section style={styles.bottomDrawerSection} showDivider={false}>
          <Drawer.Item
            label="My Profile"
            icon={({ size, color }) => <User size={size} color={color} />}
            active={active === "profile"}
            onPress={() => {
              setActive("profile");
              navigation.navigate("MyProfile");
            }}
            style={active === "profile" ? { borderRadius: 10 } : null} // Apply 10px border radius for active item
          />
          <Drawer.Item
            label="Logout"
            icon={({ size }) => <LogOut size={size} color={"red"} />}
            onPress={() => {
              // Perform logout logic if desired.
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
    marginTop: 40, // Added gap from above
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
