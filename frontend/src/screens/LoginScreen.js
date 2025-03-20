import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env'; // Import environment variable

const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showToast = (type, message) => {
    Toast.show({
      type: type, // 'success' or 'error'
      text1: message,
      position: 'bottom',
      visibilityTime: 4000, // Display for 4 seconds
      bottomOffset: 50, // Adjust bottom offset
    });
  };

  const storeTokens = async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      showToast('error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await storeTokens(data.accessToken, data.refreshToken);
        showToast('success', 'Login successful!');
        console.log(data.user); // Store user info in state/context if needed
        // Navigate to the next screen here
      } else {
        showToast('error', data.message || 'Invalid email or password.');
      }
    } catch (error) {
      setLoading(false);
      showToast('error', 'Network error. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!!!</Text>
      <Text style={styles.subtitle}>
        Log in to continue from where you left off
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email or phone number"
        value={identifier}
        onChangeText={setIdentifier}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <Button
        title={loading ? 'Logging in...' : 'Log In'}
        onPress={handleLogin}
        disabled={loading}
      />

      <Text style={styles.signupText}>
        Don’t have an account?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  forgotPassword: { textAlign: 'right', color: 'blue', marginBottom: 20 },
  signupText: { textAlign: 'center', marginTop: 10 },
  signupLink: { color: 'blue', fontWeight: 'bold' },
});

export default LoginScreen;
