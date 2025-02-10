import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { LayoutDashboard, Bell } from 'lucide-react-native';

const AppHeader = ({ title, onMenuPress, onNotificationPress }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Left: Menu Icon */}
      <TouchableRipple
        onPress={onMenuPress}
        style={styles.iconButton}
        rippleColor="rgba(0, 0, 0, 0.1)"
      >
        <LayoutDashboard size={24} color="#000" />
      </TouchableRipple>

      {/* Center: Screen Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right: Notifications Icon */}
      <TouchableRipple
        onPress={onNotificationPress}
        style={styles.iconButton}
        rippleColor="rgba(0, 0, 0, 0.1)"
      >
        <Bell size={24} color="#000" />
      </TouchableRipple>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'transparent', // Set background to transparent
    // Remove elevation and shadow properties if not needed
    // elevation: 0,
    // shadowColor: 'transparent',
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AppHeader;
