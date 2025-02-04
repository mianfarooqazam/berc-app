// components/Splash/SplashScreen.js
import React, { useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Navigate to RoleSelection screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('RoleSelection');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/berc-logo.jpeg')} style={styles.logo} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
