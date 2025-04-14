import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import UsersScreen from './UsersScreen';
import InventoryScreen from './InventoryScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const THEME_STORAGE_KEY = 'themePreference';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    loadThemePreference();
  }, []);

  const toggleDarkMode = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'fade_from_bottom', // 'slide_from_right', 'fade_from_bottom', etc.
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login">
              {props => (
                <LoginScreen
                  {...props}
                  onNavigateToRegister={() => props.navigation.navigate('Register')}
                  onLoginSuccess={handleLoginSuccess}
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {props => (
                <RegisterScreen
                  {...props}
                  onNavigateToLogin={() => props.navigation.navigate('Login')}
                  onRegisterSuccess={() => {
                    props.navigation.navigate('Login');
                    Alert.alert('Éxito', 'Registro exitoso. Ahora puedes iniciar sesión.');
                  }}
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Home">
              {props => (
                <HomeScreen
                  {...props}
                  onLogout={handleLogout}
                  isDarkMode={isDarkMode}
                  onNavigateToUsers={() => props.navigation.navigate('Usuarios')}
                  onNavigateToInventory={() => props.navigation.navigate('Inventario')}
                  onToggleTheme={toggleDarkMode}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Usuarios"
              options={{ animation: 'slide_from_right' }}
            >
              {props => (
                <UsersScreen
                  {...props}
                  isDarkMode={isDarkMode}
                  goBackToHome={() => props.navigation.goBack()}
                  onToggleTheme={toggleDarkMode}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Inventario"
              options={{ animation: 'slide_from_right' }}
            >
              {props => (
                <InventoryScreen
                  {...props}
                  isDarkMode={isDarkMode}
                  onGoBack={() => props.navigation.goBack()}
                  onToggleTheme={toggleDarkMode}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
});
