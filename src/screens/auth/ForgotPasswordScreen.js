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
import { SPACING, FONT_SIZES } from '../../constants/dimensions';

const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handle password reset request
  const handleResetPassword = async () => {
    // Validate input
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // In a real app, this would call an API to initiate the password reset process
      // For now, we'll just simulate a successful request after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate back to login screen
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
            Reset Password
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Enter your email address to receive a password reset link
          </Text>
        </View>
        
        <View style={styles.form}>
          {success ? (
            <View style={[styles.successContainer, { backgroundColor: theme.success.light }]}>
              <Text style={[styles.successText, { color: theme.success.dark }]}>
                Password reset link sent! Please check your email.
              </Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary.main }]}
                onPress={goToLogin}
              >
                <Text style={[styles.buttonText, { color: theme.primary.contrast }]}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
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
              
              {/* Display Error */}
              {error ? (
                <Text style={[styles.errorText, { color: theme.error.main }]}>
                  {error}
                </Text>
              ) : null}
              
              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.primary.main }
                ]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.primary.contrast} />
                ) : (
                  <Text style={[styles.buttonText, { color: theme.primary.contrast }]}>
                    Send Reset Link
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
        
        {/* Back to Login Link */}
        {!success && (
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text.secondary }]}>
              Remember your password?{' '}
            </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={[styles.linkText, { color: theme.primary.main }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    color: 'red',
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
  successContainer: {
    padding: SPACING.LARGE,
    borderRadius: SPACING.SMALL,
    marginBottom: SPACING.LARGE,
  },
  successText: {
    fontSize: FONT_SIZES.MEDIUM,
    marginBottom: SPACING.LARGE,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;