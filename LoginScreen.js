import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { styles } from './styles';
import { InputField, FormButton } from './CustomComponents';
import * as MediaLibrary from 'expo-media-library';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const validateEmailFormat = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

const LoginScreen = ({ onNavigateToRegister, onLoginSuccess, isDarkMode, toggleDarkMode }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const emailInputRef = useRef(null);

  // Seguridad: intentos de login
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
    setEmail("");
    setPassword("");
    setEmailError("");
  }, []);

  useEffect(() => {
    let timer;
    if (isBlocked && blockTimeLeft > 0) {
      timer = setTimeout(() => {
        setBlockTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isBlocked && blockTimeLeft === 0) {
      setIsBlocked(false);
      setLoginAttempts(0);
    }
    return () => clearTimeout(timer);
  }, [blockTimeLeft, isBlocked]);

  const solicitarPermisoArchivos = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permiso necesario",
        "La app necesita acceso a tus archivos (fotos/media) para algunas funcionalidades. Por favor actívalo en configuración.",
        [
          {
            text: "Abrir configuración",
            onPress: () => Linking.openSettings(),
          },
          { text: "Cancelar", style: "cancel" }
        ]
      );
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (isBlocked) {
      Alert.alert("Demasiados intentos", `Por favor, espera ${blockTimeLeft} segundos`);
      return;
    }

    if (!email || !password) {
      Alert.alert("Error", "Por favor, ingresa todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        Alert.alert("Inicio de sesión exitoso", `Bienvenido ${user.email}`);
        setLoginAttempts(0);
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginAttempts((prev) => prev + 1);

      if (loginAttempts + 1 >= 5) {
        setIsBlocked(true);
        setBlockTimeLeft(30);
        Alert.alert("Demasiados intentos", "Has excedido el número de intentos. Inténtalo de nuevo más tarde.");
      } else {
        if (error.code === 'auth/user-not-found') {
          Alert.alert("Error", "El usuario no fue encontrado.");
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert("Error", "Contraseña incorrecta.");
        } else {
          Alert.alert("Error", "Hubo un problema al iniciar sesión.");
        }
      }
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

        <FormButton
          title="Iniciar Sesión"
          onPress={handleLogin}
          isDarkMode={isDarkMode}
          isLoading={isLoading}
          disabled={isBlocked}
        />

        {isBlocked && (
          <Text style={{ color: 'red', marginTop: 10 }}>
            Espera {blockTimeLeft} segundos para volver a intentar
          </Text>
        )}

        <TouchableOpacity onPress={onNavigateToRegister}>
          <Text style={[styles.link, isDarkMode && styles.darkText]}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </Animatable.View>

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
