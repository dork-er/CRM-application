import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import LoginScreen from './src/screens/LoginScreen';
import { API_BASE_URL } from '@env';

const Stack = createStackNavigator();

export default function App() {
  console.log('Backend URL:', API_BASE_URL); // Debugging .env

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* Toast should be outside NavigationContainer */}
      <Toast />
    </SafeAreaProvider>
  );
}
