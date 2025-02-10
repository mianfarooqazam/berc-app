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

export default function AdminDrawerContent({ navigation, email, designation, state }) {
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const currentEmail = email || "admin@example.com";
  const [employeeDesignation, setEmployeeDesignation] = useState(designation || "Director");

  // Use the navigation state provided in props to determine the active route.
  const currentRoute = state.routes[state.index].name;

  useEffect(() => {
    // Function to fetch the employee data if the logged-in email matches an employee_email in Firestore
    async function fetchEmployeeData() {
      try {
        const q = query(
          collection(db, "employees"),
          where("employee_email", "==", currentEmail)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data();
          setEmployeeId(employeeData.employee_id);
          setEmployeeName(employeeData.name);
          if (employeeData.designation) {
            setEmployeeDesignation(employeeData.designation);
          }
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }
    fetchEmployeeData();
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
          {employeeName ? (
            <Text style={styles.username}>{employeeName}</Text>
          ) : null}
          <Text style={styles.designation}>{employeeDesignation}</Text>
          {employeeId && (
            <Text style={styles.employeeId}>Employee ID: {employeeId}</Text>
          )}
          <Text style={styles.email}>{currentEmail}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Main Drawer Items */}
        <Drawer.Section style={styles.drawerSection} showDivider={false}>
          <Drawer.Item
            label="Home"
            icon={({ size, color }) => <Home size={size} color={color} />}
            active={currentRoute === "Home"}
            onPress={() => navigation.navigate("Home")}
            style={currentRoute === "Home" ? { borderRadius: 10 } : null}
          />
          <Drawer.Item
            label="Assign Task"
            icon={({ size, color }) => <Clipboard size={size} color={color} />}
            active={currentRoute === "AssignTask"}
            onPress={() => navigation.navigate("AssignTask")}
            style={currentRoute === "AssignTask" ? { borderRadius: 10 } : null}
          />
          <Drawer.Item
            label="Tasks Status"
            icon={({ size, color }) => <CircleAlert size={size} color={color} />}
            active={currentRoute === "TaskStatus"}
            onPress={() => navigation.navigate("TaskStatus")}
            style={currentRoute === "TaskStatus" ? { borderRadius: 10 } : null}
          />
          <Drawer.Item
            label="Upcoming Events"
            icon={({ size, color }) => <Calendar1 size={size} color={color} />}
            active={currentRoute === "Events"}
            onPress={() => navigation.navigate("Events")}
            style={currentRoute === "Events" ? { borderRadius: 10 } : null}
          />
          <Drawer.Item
            label="Employees"
            icon={({ size, color }) => <Users size={size} color={color} />}
            active={currentRoute === "Employee"}
            onPress={() => navigation.navigate("Employee")}
            style={currentRoute === "Employee" ? { borderRadius: 10 } : null}
          />
        </Drawer.Section>

        {/* Bottom Section */}
        <Drawer.Section style={styles.bottomDrawerSection} showDivider={false}>
          <Drawer.Item
            label="My Profile"
            icon={({ size, color }) => <User size={size} color={color} />}
            active={currentRoute === "MyProfile"}
            onPress={() => navigation.navigate("MyProfile")}
            style={currentRoute === "MyProfile" ? { borderRadius: 10 } : null}
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
  username: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
    fontWeight: "bold",
  },
  designation: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  employeeId: {
    fontSize: 8,
    color: "#444",
    marginBottom: 5,
    fontWeight: "normal",
  },
  email: {
    fontSize: 8,
    color: "#444",
    marginBottom: 5,
    fontWeight: "normal",
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
