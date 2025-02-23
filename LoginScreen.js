// LoginScreen.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { styles } from './styles';
import { InputField, FormButton } from './CustomComponents';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage


// --- Helper Functions ---
const validateEmailFormat = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

// --- Main Component ---
const LoginScreen = ({ onNavigateToRegister, onLoginSuccess, isDarkMode, toggleDarkMode }) => { // Add onLoginSuccess
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
    setEmail("");
    setPassword("");
    setEmailError("");
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, ingresa todos los campos");
      return;
    }
    setIsLoading(true);
        try {
            // 1. Get users from AsyncStorage
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];

            // 2. Find user with matching email and password
            const user = users.find(u => u.email === email && u.password === password);

            // 3. Handle login success/failure
            if (user) {
                // Successful login
                onLoginSuccess(); // Navigate to home screen
            } else {
                // Failed login
                Alert.alert("Error", "Email o contraseña incorrectos.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            Alert.alert("Error", "Hubo un problema al iniciar sesión.");
        } finally {
            setIsLoading(false);
        }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Animatable.Image
        animation="bounceIn"
        source={require("./assets/login-background.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Animatable.View style={[styles.formContainer, isDarkMode && styles.darkFormContainer]}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Iniciar Sesión</Text>
        <InputField
          iconName="mail-outline"
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(validateEmailFormat(text) ? "" : "Email inválido");
          }}
          isDarkMode={isDarkMode}
          error={emailError}
          ref={emailInputRef}
        />
        {emailError ? <Text style={[styles.errorText, isDarkMode && styles.darkErrorText]}>{emailError}</Text> : null}

        <InputField
          iconName="lock-closed-outline"
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          isPassword={true}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isDarkMode={isDarkMode}
        />
        <FormButton title="Iniciar Sesión" onPress={handleLogin} isDarkMode={isDarkMode} isLoading={isLoading} />
        <TouchableOpacity onPress={onNavigateToRegister}>
          <Text style={[styles.link, isDarkMode && styles.darkText]}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </Animatable.View>
      {/* Dark Mode Button */}
      <TouchableOpacity style={[styles.darkModeButton, isDarkMode && styles.darkButton]} onPress={toggleDarkMode}>
        <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={isDarkMode ? "white" : "#0D47A1"} />
        <Text style={[styles.darkModeButtonText, isDarkMode && styles.darkText]}>
          {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;