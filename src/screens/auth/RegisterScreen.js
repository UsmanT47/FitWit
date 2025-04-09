import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await register({ name, email, password });
      // On successful registration, the AuthContext will update isAuthenticated
      // and the AppNavigator will automatically redirect to the main app
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
          <StatusBar style={theme.isDarkMode ? 'light' : 'dark'} />
          
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.text.primary }]}>Create Account</Text>
              <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
                Sign up to start your health journey
              </Text>
            </View>
            
            <View style={styles.formContainer}>
              {error ? (
                <View style={[styles.errorContainer, { backgroundColor: theme.error.light }]}>
                  <Text style={[styles.errorText, { color: theme.error.dark }]}>{error}</Text>
                </View>
              ) : null}
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text.primary }]}>Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.input.background,
                      borderColor: theme.input.border,
                      color: theme.text.primary
                    }
                  ]}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.input.placeholder}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text.primary }]}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.input.background,
                      borderColor: theme.input.border,
                      color: theme.text.primary
                    }
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.input.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text.primary }]}>Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.input.background,
                      borderColor: theme.input.border,
                      color: theme.text.primary
                    }
                  ]}
                  placeholder="Enter password"
                  placeholderTextColor={theme.input.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text.primary }]}>Confirm Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.input.background,
                      borderColor: theme.input.border,
                      color: theme.text.primary
                    }
                  ]}
                  placeholder="Confirm password"
                  placeholderTextColor={theme.input.placeholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  { backgroundColor: theme.primary.main },
                  loading && { opacity: 0.7 }
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.loginContainer}>
                <Text style={[styles.loginText, { color: theme.text.secondary }]}>
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={[styles.loginLink, { color: theme.primary.main }]}>
                    {' Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  errorContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  registerButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;