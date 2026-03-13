import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContextProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';

import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import RoleSelect from './src/screens/auth/RoleSelectScreen';
import Login from './src/screens/auth/LoginScreen';
import SignUp from './src/screens/auth/SignUpScreen';

import TrainerDashboard from './src/screens/trainer/TrainerDashboard';
import ClientsScreen from './src/screens/trainer/ClientsScreen';
import TrainerAnalytics from './src/screens/trainer/TrainerAnalytics';
import DietPlanBuilder from './src/screens/trainer/DietPlanBuilder';
import WorkoutBuilder from './src/screens/trainer/WorkoutBuilder';
import TrainerChat from './src/screens/trainer/TrainerChat';

import ClientDashboard from './src/screens/client/ClientDashboard';
import MealTracker from './src/screens/client/MealTracker';
import WorkoutView from './src/screens/client/WorkoutView';
import ProgressScreen from './src/screens/client/ProgressScreen';
import ClientChat from './src/screens/client/ClientChat';

const Stack = createNativeStackNavigator();

// Root Navigator decides which screens to show based on user login and role
function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          user.role === 'trainer' ? (
            <>
              <Stack.Screen name="TrainerDashboard" component={TrainerDashboard} />
              <Stack.Screen name="Clients" component={ClientsScreen} />
              <Stack.Screen name="TrainerAnalytics" component={TrainerAnalytics} />
              <Stack.Screen name="DietPlanBuilder" component={DietPlanBuilder} />
              <Stack.Screen name="WorkoutBuilder" component={WorkoutBuilder} />
              <Stack.Screen name="TrainerChat" component={TrainerChat} />
            </>
          ) : (
            <>
              <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
              <Stack.Screen name="MealTracker" component={MealTracker} />
              <Stack.Screen name="WorkoutView" component={WorkoutView} />
              <Stack.Screen name="Progress" component={ProgressScreen} />
              <Stack.Screen name="ClientChat" component={ClientChat} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="RoleSelect" component={RoleSelect} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App
export default function App() {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <RootNavigator />
      </AuthContextProvider>
    </ThemeProvider>
  );
}