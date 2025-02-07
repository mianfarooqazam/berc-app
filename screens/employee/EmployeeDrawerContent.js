// screens/employee/EmployeeDrawerContent.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer, Text, Divider } from 'react-native-paper';
import { Home, Calendar1, User, LogOut, CircleAlert } from 'lucide-react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure the path is correct

export default function EmployeeDrawerContent({ navigation, email }) {
  const [active, setActive] = useState("home");
  const currentEmail = email || "employee@uet.com";
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState(""); // For the username
  const [employeeDesignation, setEmployeeDesignation] = useState("Employee");

  useEffect(() => {
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
            source={require("../../assets/profile.webp")} // Replace with your employee profile image path.
            style={styles.profilePicture}
          />
          {/* Display the data in the following order:
              1. Name (bold)
              2. Designation (bold)
              3. Employee ID (not bold, 8px font size)
              4. Email (not bold, 8px font size)
          */}
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
            active={active === "home"}
            onPress={() => {
              setActive("home");
              navigation.navigate("Home");
            }}
            style={active === "home" ? { borderRadius: 10 } : null}
          />
          <Drawer.Item
            label="Assigned Tasks"
            icon={({ size, color }) => <CircleAlert size={size} color={color} />}
            active={active === "assignedTasks"}
            onPress={() => {
              setActive("assignedTasks");
              navigation.navigate("AssignedTasks");
            }}
            style={active === "assignedTasks" ? { borderRadius: 10 } : null}
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
  employeeId: {
    fontSize: 8,
    color: "#444",
    marginBottom: 5,
    fontWeight: "normal", // Not bold
  },
  email: {
    fontSize: 8,
    color: "#444",
    marginBottom: 5,
    fontWeight: "normal", // Not bold
  },
  username: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
    fontWeight: "bold", // Bold for Name (username)
  },
  designation: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold", // Bold for Designation
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
