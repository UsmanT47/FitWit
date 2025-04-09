import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <StatusBar style={theme.isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text.primary }]}>Welcome to FitWit</Text>
        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
          Your personal health and fitness companion
        </Text>
      </View>
      
      <View style={styles.imageContainer}>
        <View style={[styles.imagePlaceholder, { backgroundColor: theme.background.secondary }]}>
          <Text style={{ color: theme.text.secondary }}>App Logo</Text>
        </View>
      </View>
      
      <View style={styles.featuresContainer}>
        <Text style={[styles.featureTitle, { color: theme.text.primary }]}>Key Features:</Text>
        
        <View style={styles.feature}>
          <View style={[styles.featureIcon, { backgroundColor: theme.primary.main }]} />
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureText, { color: theme.text.primary }]}>Track your health metrics</Text>
          </View>
        </View>
        
        <View style={styles.feature}>
          <View style={[styles.featureIcon, { backgroundColor: theme.secondary.main }]} />
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureText, { color: theme.text.primary }]}>Get AI-powered insights</Text>
          </View>
        </View>
        
        <View style={styles.feature}>
          <View style={[styles.featureIcon, { backgroundColor: theme.error.main }]} />
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureText, { color: theme.text.primary }]}>Log food with barcode scanner</Text>
          </View>
        </View>
        
        <View style={styles.feature}>
          <View style={[styles.featureIcon, { backgroundColor: theme.success.main }]} />
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureText, { color: theme.text.primary }]}>Sync with fitness devices</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary.main }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.primary.main }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.primary.main }]}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  button: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;