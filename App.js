// App.js (or your main app file)
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'; // Import StyleSheet
import LoginScreen from './LoginScreen'; // Adjust path if needed
import RegisterScreen from './RegisterScreen'; // Adjust path if needed

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const navigateToRegister = () => {
    setShowLogin(false);
  };

  const navigateToLogin = () => {
    setShowLogin(true);
  };

  return (
    <View style={styles.container}>
        {showLogin ? (
        <LoginScreen onNavigateToRegister={navigateToRegister} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
      ) : (
        <RegisterScreen onNavigateToLogin={navigateToLogin} isDarkMode={isDarkMode} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})

export default App;