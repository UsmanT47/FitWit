import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CustomButton from '../../components/CustomButton';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { validateEmail } from '../../utils/validators';

const SignupScreen = ({ navigation }) => {
  const { register } = useAuth();
  const { theme } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle signup
  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await register({ name, email, password });
      
      if (!result.success) {
        Alert.alert('Registration Failed', result.error || 'Please check your information');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate back to login
  const goToLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={goToLogin}
              accessibilityLabel="Go back to sign in"
              accessibilityRole="button"
            >
              <Feather name="arrow-left" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.appTitle, { color: theme.primary }]}>FitWit</Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary }]}>Create your account</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: theme.text }]}>Join FitWit</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Start your journey to a healthier you
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
              <View style={[
                styles.inputContainer, 
                { 
                  backgroundColor: theme.input,
                  borderColor: errors.name ? theme.danger : theme.inputBorder
                }
              ]}>
                <Feather name="user" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  testID="signup-name-input"
                  accessibilityLabel="Full name input field"
                />
              </View>
              {errors.name && (
                <Text style={[styles.errorText, { color: theme.danger }]}>
                  {errors.name}
                </Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <View style={[
                styles.inputContainer, 
                { 
                  backgroundColor: theme.input,
                  borderColor: errors.email ? theme.danger : theme.inputBorder
                }
              ]}>
                <Feather name="mail" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  testID="signup-email-input"
                  accessibilityLabel="Email input field"
                />
              </View>
              {errors.email && (
                <Text style={[styles.errorText, { color: theme.danger }]}>
                  {errors.email}
                </Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Password</Text>
              <View style={[
                styles.inputContainer, 
                { 
                  backgroundColor: theme.input,
                  borderColor: errors.password ? theme.danger : theme.inputBorder
                }
              ]}>
                <Feather name="lock" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Create a password"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  testID="signup-password-input"
                  accessibilityLabel="Password input field"
                />
                <TouchableOpacity 
                  onPress={togglePasswordVisibility}
                  style={styles.passwordToggle}
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  accessibilityRole="button"
                >
                  <Feather 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color={theme.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={[styles.errorText, { color: theme.danger }]}>
                  {errors.password}
                </Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
              <View style={[
                styles.inputContainer, 
                { 
                  backgroundColor: theme.input,
                  borderColor: errors.confirmPassword ? theme.danger : theme.inputBorder
                }
              ]}>
                <Feather name="lock" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  testID="signup-confirm-password-input"
                  accessibilityLabel="Confirm password input field"
                />
              </View>
              {errors.confirmPassword && (
                <Text style={[styles.errorText, { color: theme.danger }]}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
            
            <CustomButton
              title="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              disabled={isLoading}
              style={styles.signupButton}
              accessibilityLabel="Create account button"
            />
            
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: theme.textSecondary }]}>
                Already have an account?
              </Text>
              <TouchableOpacity 
                onPress={goToLogin}
                accessibilityLabel="Sign in instead"
                accessibilityRole="button"
              >
                <Text style={[styles.loginLink, { color: theme.primary }]}>
                  {' Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: SPACING.sm,
  },
  appTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  appSubtitle: {
    fontSize: FONT_SIZES.md,
  },
  formContainer: {
    marginTop: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.lg,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
  },
  inputIcon: {
    marginHorizontal: SPACING.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingRight: SPACING.sm,
  },
  passwordToggle: {
    padding: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  signupButton: {
    marginTop: SPACING.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  loginText: {
    fontSize: FONT_SIZES.sm,
  },
  loginLink: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});

export default SignupScreen;
