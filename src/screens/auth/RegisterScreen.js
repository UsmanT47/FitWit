import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';

const RegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { register } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handle registration
  const handleRegister = async () => {
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Call register function from Auth context
      await register({ username, email, password });
      
      // Registration successful - Auth context will handle navigation
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate to login screen
  const goToLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.container, 
          { backgroundColor: theme.background.primary }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Sign up to start tracking your health
          </Text>
        </View>
        
        <View style={styles.form}>
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text.secondary }]}>
              Username
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.background.secondary,
                  color: theme.text.primary,
                  borderColor: theme.border
                }
              ]}
              placeholder="Choose a username"
              placeholderTextColor={theme.text.tertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text.secondary }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.background.secondary,
                  color: theme.text.primary,
                  borderColor: theme.border
                }
              ]}
              placeholder="Enter your email"
              placeholderTextColor={theme.text.tertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text.secondary }]}>
              Password
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.background.secondary,
                  color: theme.text.primary,
                  borderColor: theme.border
                }
              ]}
              placeholder="Create a password"
              placeholderTextColor={theme.text.tertiary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text.secondary }]}>
              Confirm Password
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.background.secondary,
                  color: theme.text.primary,
                  borderColor: theme.border
                }
              ]}
              placeholder="Confirm your password"
              placeholderTextColor={theme.text.tertiary}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          
          {/* Display Error */}
          {error ? (
            <Text style={[styles.errorText, { color: theme.error.main }]}>
              {error}
            </Text>
          ) : null}
          
          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.primary.main }
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.primary.contrast} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.primary.contrast }]}>
                Sign Up
              </Text>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text.secondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={goToLogin}>
            <Text style={[styles.linkText, { color: theme.primary.main }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.LARGE,
    justifyContent: 'center',
  },
  header: {
    marginBottom: SPACING.XLARGE,
  },
  title: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold',
    marginBottom: SPACING.SMALL,
  },
  subtitle: {
    fontSize: FONT_SIZES.MEDIUM,
  },
  form: {
    marginBottom: SPACING.XLARGE,
  },
  inputContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  label: {
    fontSize: FONT_SIZES.SMALL,
    marginBottom: SPACING.TINY,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
    fontSize: FONT_SIZES.REGULAR,
  },
  errorText: {
    fontSize: FONT_SIZES.SMALL,
    marginBottom: SPACING.MEDIUM,
  },
  button: {
    height: 50,
    borderRadius: SPACING.SMALL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.MEDIUM,
  },
  linkText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;