// auth/RoleSelectionScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableRipple, Text } from 'react-native-paper';
import { User, Users } from 'lucide-react-native';

export default function RoleSelectionScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time without seconds
  const timeString = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Format date as "Wednesday 21, Jan"
  const weekday = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const day = currentTime.getDate();
  const month = currentTime.toLocaleDateString('en-US', { month: 'short' });
  const dateString = `${weekday} ${day}, ${month}`;

  // Helper functions for icons with specific color
  const renderUsersIcon = () => <Users size={24} color="#97d43b" />;
  const renderUserIcon = () => <User size={24} color="#97d43b" />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Main content: time and buttons */}
      <View style={styles.mainContent}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{timeString}</Text>
          <Text style={styles.dateText}>{dateString}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableRipple
            style={styles.button}
            onPress={() => navigation.navigate('Login', { role: 'employee' })}
            rippleColor="rgba(0, 0, 0, 0.1)"
          >
            <View style={styles.buttonContent}>
              {renderUsersIcon()}
              <Text style={styles.buttonRole}>Employee</Text>
              <Text style={styles.buttonLogin}>Login</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            style={styles.button}
            onPress={() => navigation.navigate('Login', { role: 'admin' })}
            rippleColor="rgba(0, 0, 0, 0.1)"
          >
            <View style={styles.buttonContent}>
              {renderUserIcon()}
              <Text style={styles.buttonRole}>Admin</Text>
              <Text style={styles.buttonLogin}>Login</Text>
            </View>
          </TouchableRipple>
        </View>
      </View>

      {/* Footer view */}
      <View style={styles.footer}>
        <Text style={styles.footerHeading}>BUILDINGS ENERGY RESEARCH CENTER</Text>
        <Text style={styles.footerText}>
          BERC AIMS TO BUILD A SUSTAINABLE PAKISTAN BRICK BY BRICK
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
    paddingHorizontal: '5%',
    paddingVertical: '5%',
    justifyContent: 'space-between', 
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-evenly', 
    alignItems: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: '3%',
  },
  timeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 18,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: '3%',
  },
  button: {
    width: '30%',
    aspectRatio: 1,
    marginHorizontal: '2%',
    backgroundColor: '#ffff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRole: {
    color: '#000',
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonLogin: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    backgroundColor: '#edebfb',
    paddingVertical: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: '5%',
  },
  footerText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});
