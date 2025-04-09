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

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { theme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await login({ email, password });
      
      if (!result.success) {
        Alert.alert('Login Failed', result.error || 'Please check your credentials');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate to signup screen
  const goToSignup = () => {
    navigation.navigate('Signup');
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
            <Text style={[styles.appTitle, { color: theme.primary }]}>FitWit</Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary }]}>Your personal health journal</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: theme.text }]}>Welcome Back!</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Sign in to continue tracking your health journey
            </Text>
            
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
                  testID="login-email-input"
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
                  placeholder="Enter your password"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  testID="login-password-input"
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
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              accessibilityLabel="Forgot password"
              accessibilityRole="button"
            >
              <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            
            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              accessibilityLabel="Sign in button"
            />
            
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: theme.textSecondary }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity 
                onPress={goToSignup}
                accessibilityLabel="Create account"
                accessibilityRole="button"
              >
                <Text style={[styles.signupLink, { color: theme.primary }]}>
                  {' Create Account'}
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
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
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
    marginTop: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.xl,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  signupText: {
    fontSize: FONT_SIZES.sm,
  },
  signupLink: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});

export default LoginScreen;
