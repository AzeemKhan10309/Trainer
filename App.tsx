import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContextProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import RoleSelect from './src/screens/auth/RoleSelectScreen';
import Login from './src/screens/auth/LoginScreen';
import SignUp from './src/screens/auth/SignUpScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="RoleSelect" component={RoleSelect} />
            <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignUp" component={SignUp} />  {/* <-- Add this */}

          </Stack.Navigator>
        </NavigationContainer>
      </AuthContextProvider>
    </ThemeProvider>
  );
}