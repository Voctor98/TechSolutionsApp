// App.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native'; 
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import UsersScreen from './UsersScreen'; 
import InventoryScreen from './InventoryScreen'; // Importar la pantalla Inventory

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showInventory, setShowInventory] = useState(false); // Nuevo estado para InventoryScreen

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const navigateToRegister = () => {
    setShowLogin(false);
    setShowUsers(false);
    setShowInventory(false); // Asegurarse de que no se vea InventoryScreen
  };

  const navigateToLogin = () => {
    setShowLogin(true);
    setShowUsers(false);
    setShowInventory(false); // Asegurarse de que no se vea InventoryScreen
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowUsers(false);
    setShowInventory(false); // Asegurarse de que no se vea InventoryScreen
  };

  const handleRegisterSuccess = () => {
    setShowLogin(true);
    Alert.alert("Éxito", "Registro exitoso. Ahora puedes iniciar sesión.");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUsers(false);
    setShowInventory(false); // Asegurarse de que no se vea InventoryScreen
  };

  const navigateToUsers = () => {
    setShowUsers(true);
    setShowInventory(false); // Asegurarse de que no se vea InventoryScreen
  };

  const navigateToInventory = () => {
    setShowInventory(true);
    setShowUsers(false); // Asegurarse de que no se vea UsersScreen
  };

  const goBackToHome = () => {
    setShowInventory(false);
    setShowUsers(false);
  };

  return (
      <View style={styles.container}>
        {isLoggedIn ? (
          showUsers ? (
            <UsersScreen isDarkMode={isDarkMode} goBackToHome={goBackToHome}/>
          ) : showInventory ? (
            <InventoryScreen onGoBack={goBackToHome} /> // Aquí renderizamos InventoryScreen
          ) : (
            <HomeScreen 
              onLogout={handleLogout} 
              isDarkMode={isDarkMode} 
              onNavigateToUsers={navigateToUsers} 
              onNavigateToInventory={navigateToInventory} // Pasamos la función para navegar a Inventory
            />
          )
        ) : showLogin ? (
          <LoginScreen 
            onNavigateToRegister={navigateToRegister} 
            onLoginSuccess={handleLoginSuccess} 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
          />
        ) : (
          <RegisterScreen 
            onNavigateToLogin={navigateToLogin} 
            onRegisterSuccess={handleRegisterSuccess} 
            isDarkMode={isDarkMode} 
          />
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
