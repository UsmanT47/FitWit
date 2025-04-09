import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();

// Temporary Login Screen
const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { theme } = useTheme();
  
  const handleLogin = async () => {
    const result = await login({ email: 'test@example.com', password: 'password123' });
    if (!result.success) {
      alert(result.error);
    }
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.primary,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 10,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    secondaryButton: {
      marginTop: 10,
      padding: 10,
    },
    secondaryButtonText: {
      color: theme.primary,
      fontSize: 16,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FitWit</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login as Test User</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.secondaryButtonText}>Create an Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.secondaryButtonText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

// Temporary Register Screen
const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const { theme } = useTheme();
  
  const handleRegister = async () => {
    const userData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
    };
    
    const result = await register(userData);
    if (!result.success) {
      alert(result.error);
    }
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.primary,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 10,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    secondaryButton: {
      marginTop: 10,
      padding: 10,
    },
    secondaryButtonText: {
      color: theme.primary,
      fontSize: 16,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register as New User</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.secondaryButtonText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Temporary Forgot Password Screen
const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.primary,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 10,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    secondaryButton: {
      marginTop: 10,
      padding: 10,
    },
    secondaryButtonText: {
      color: theme.primary,
      fontSize: 16,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => alert('Password reset link sent!')}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.secondaryButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;