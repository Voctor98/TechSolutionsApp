// App.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native'; //CORRECT IMPORT
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import UsersScreen from './UsersScreen'; // Import UsersScreen

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUsers, setShowUsers] = useState(false); // New state for UsersScreen

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const navigateToRegister = () => {
    setShowLogin(false);
    setShowUsers(false); // Hide UsersScreen when navigating away
  };

  const navigateToLogin = () => {
    setShowLogin(true);
    setShowUsers(false); // Hide UsersScreen when navigating away
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowUsers(false); // Ensure UsersScreen is hidden initially
  };

  const handleRegisterSuccess = () => {
    // After successful registration, go to login screen
    setShowLogin(true);
    Alert.alert("Éxito", "Registro exitoso. Ahora puedes iniciar sesión.");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUsers(false); // Hide UsersScreen on logout
  };

    const navigateToUsers = () => {
    setShowUsers(true);
  };

  const goBackToHome = () => {
      setShowUsers(false);
  }

  return (
      <View style={styles.container}>
        {isLoggedIn ? (
          showUsers ? (
            <UsersScreen isDarkMode={isDarkMode} goBackToHome={goBackToHome}/>
          ) : (
            <HomeScreen onLogout={handleLogout} isDarkMode={isDarkMode} onNavigateToUsers={navigateToUsers} />
          )
        ) : showLogin ? (
          <LoginScreen onNavigateToRegister={navigateToRegister} onLoginSuccess={handleLoginSuccess} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        ) : (
          <RegisterScreen onNavigateToLogin={navigateToLogin} onRegisterSuccess={handleRegisterSuccess} isDarkMode={isDarkMode} />
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;