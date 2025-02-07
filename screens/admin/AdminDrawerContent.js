// screens/admin/AdminDrawerContent.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Drawer, Text, Divider } from "react-native-paper";
import {
  Home,
  User,
  Clipboard,
  Calendar1,
  Users,
  LogOut,
  CircleAlert,
} from "lucide-react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Ensure the correct path to your firebase.js

export default function AdminDrawerContent({ navigation, email, designation }) {
  const [active, setActive] = useState("home");
  const [employeeId, setEmployeeId] = useState(null);

  // Use the provided email and designation (with fallback values if necessary)
  const currentEmail = email || "admin@example.com";
  const currentDesignation = designation || "Director";

  useEffect(() => {
    // Function to fetch the employee_id if the logged in email matches an employee_email in Firestore
    async function fetchEmployeeId() {
      try {
        const q = query(
          collection(db, "employees"),
          where("employee_email", "==", currentEmail)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // If a document is found, retrieve the employee_id
          const employeeData = querySnapshot.docs[0].data();
          setEmployeeId(employeeData.employee_id);
        }
      } catch (error) {
        console.error("Error fetching employee ID:", error);
      }
    }
    fetchEmployeeId();
  }, [currentEmail]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../../assets/profile.webp")}
            style={styles.profilePicture}
          />
          <Text style={styles.email}>{currentEmail}</Text>
          <Text style={styles.designation}>{currentDesignation}</Text>
          {/* Only display the employee id if one was found */}
          {employeeId && (
            <Text style={styles.employeeId}>Employee ID: {employeeId}</Text>
          )}
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
            label="Assign Task"
            icon={({ size, color }) => <Clipboard size={size} color={color} />}
            active={active === "assign"}
            onPress={() => {
              setActive("assign");
              navigation.navigate("AssignTask");
            }}
            style={active === "assign" ? { borderRadius: 10 } : null}
          />
          <Drawer.Item
            label="Tasks Status"
            icon={({ size, color }) => <CircleAlert size={size} color={color} />}
            active={active === "status"}
            onPress={() => {
              setActive("status");
              navigation.navigate("TaskStatus");
            }}
            style={active === "status" ? { borderRadius: 10 } : null}
          />
          <Drawer.Item
            label="Upcoming Events"
            icon={({ size, color }) => <Calendar1 size={size} color={color} />}
            active={active === "events"}
            onPress={() => {
              setActive("events");
              navigation.navigate("Events");
            }}
            style={active === "events" ? { borderRadius: 10 } : null}
          />
          <Drawer.Item
            label="Employees"
            icon={({ size, color }) => <Users size={size} color={color} />}
            active={active === "employee"}
            onPress={() => {
              setActive("employee");
              navigation.navigate("Employee");
            }}
            style={active === "employee" ? { borderRadius: 10 } : null}
          />
        </Drawer.Section>

        {/* Bottom Section */}
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
  employeeId: {
    fontSize: 14,
    color: "#444",
    marginTop: 5,
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
