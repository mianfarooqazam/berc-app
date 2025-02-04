// components/CustomHeader.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Import a back arrow icon from lucide-react-native
import { ArrowLeft } from 'lucide-react-native';

export default function CustomHeader({ onBack }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
        ) : (
          // If there is no back action, render an empty view to center the logo.
          <View style={styles.placeholder} />
        )}
        <Image source={require('../../assets/berc-logo.jpeg')} style={styles.logo} />
        {/* Right-side placeholder to balance layout */}
        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fafafa',
  },
  backButton: {
    padding: 5,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  placeholder: {
    width: 34, // Approximately the size of the back button area
  },
});
