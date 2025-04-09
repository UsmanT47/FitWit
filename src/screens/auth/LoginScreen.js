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
  ScrollView,
  Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Handle login
  const handleLogin = async () => {
    // Validate inputs
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Call login function from Auth context
      await login({ username, password });
      
      // Login successful - Auth context will handle navigation
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate to registration screen
  const goToRegister = () => {
    navigation.navigate('Register');
  };
  
  // Navigate to forgot password screen
  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Sign in to continue to FitWit
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
              placeholder="Enter your username"
              placeholderTextColor={theme.text.tertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
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
              placeholder="Enter your password"
              placeholderTextColor={theme.text.tertiary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword} onPress={goToForgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: theme.primary.main }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>
          
          {/* Display Error */}
          {error ? (
            <Text style={[styles.errorText, { color: theme.error.main }]}>
              {error}
            </Text>
          ) : null}
          
          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.primary.main }
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.primary.contrast} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.primary.contrast }]}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Register Link */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text.secondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={goToRegister}>
            <Text style={[styles.linkText, { color: theme.primary.main }]}>
              Sign Up
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.LARGE,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZES.SMALL,
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

export default LoginScreen;