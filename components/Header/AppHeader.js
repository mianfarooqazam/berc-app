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
        <View style={styles.iconCircle}>
          <LayoutDashboard size={24} color="#000" />
        </View>
      </TouchableRipple>

      {/* Center: Screen Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right: Notifications Icon */}
      <TouchableRipple
        onPress={onNotificationPress}
        style={styles.iconButton}
        rippleColor="rgba(0, 0, 0, 0.1)"
      >
        <View style={styles.iconCircle}>
          <Bell size={24} color="#000" />
        </View>
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
    backgroundColor: 'transparent',
  },
  iconButton: {
    // Optionally, add additional styling here
  },
  iconCircle: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AppHeader;
