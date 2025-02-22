import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import axios from 'axios'; // Importar axios

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const emailInputRef = useRef(null);

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
  }, [showLogin]);

  useEffect(() => {
    if (showLogin) {
      emailInputRef.current?.focus(); // Autofocus en el campo de email al cargar la pantalla
    }
  }, [showLogin]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, ingresa todos los campos");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("192.168.0.133:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Éxito", "Inicio de sesión exitoso");
        console.log("Usuario autenticado:", data.user);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al conectarse con el servidor");
    }
    setIsLoading(false);
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Por favor, ingresa todos los campos");
      return;
    }
    if (!isChecked) {
      Alert.alert("Aviso de privacidad", "Debes aceptar el aviso de privacidad para registrarte.");
      return;
    }
    setIsLoading(true);
    try {
      // Reemplazar fetch por axios
      const response = await axios.post("http://192.168.0.133:3000/register", {
        username,
        email,
        password,
      });
      
      if (response.data.success) {
        Alert.alert("Éxito", "Registro exitoso");
        console.log("Usuario registrado:", response.data.user);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      Alert.alert("Error", "Hubo un problema al conectarse con el servidor");
    }
    setIsLoading(false);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    setEmailError(regex.test(email) ? "" : "El correo electrónico es inválido");
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("Débil");
    } else if (password.length >= 6 && password.length < 10) {
      setPasswordStrength("Moderada");
    } else {
      setPasswordStrength("Fuerte");
    }
  };

  const openPrivacyPolicy = () => {
    Alert.alert(
      "Aviso de Privacidad",
      "En TechSolutions, nos comprometemos a proteger tu privacidad...",
      [{ text: "Aceptar", style: "default" }]
    );
  };

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="bounceIn"
        source={require("./assets/login-background.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Animatable.View animation="fadeInUp" style={styles.formContainer}>
        {showLogin ? (
          <>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
              <TextInput
                ref={emailInputRef}
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateEmail(text);
                }}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  checkPasswordStrength(text);
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <View style={styles.passwordStrengthContainer}>
              <Text style={styles.passwordStrengthText}>{passwordStrength}</Text>
            </View>
            {isLoading ? (
              <ActivityIndicator size="small" color="#0d47a1" />
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setShowLogin(false)}>
              <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Registrarse</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateEmail(text);
                }}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  checkPasswordStrength(text);
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <View style={styles.passwordStrengthContainer}>
              <Text style={styles.passwordStrengthText}>{passwordStrength}</Text>
            </View>
            <TouchableOpacity style={styles.privacyContainer} onPress={() => setIsChecked(!isChecked)}>
              <View style={[styles.checkbox, isChecked && styles.checkboxChecked]} />
              <Text style={styles.privacyText}>
                Acepto el{" "}
                <Text style={styles.privacyLink} onPress={openPrivacyPolicy}>
                  Aviso de Privacidad
                </Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, !isChecked && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={!isChecked || isLoading}
            >
              {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.buttonText}>Registrarse</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLogin(true)}>
              <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </>
        )}
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  logo: { width: width * 0.8, height: height * 0.2 },
  formContainer: { width: width * 0.85 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20, borderBottomWidth: 1, borderColor: "gray" },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  passwordInput: { flex: 1, fontSize: 16 },
  passwordStrengthContainer: { marginTop: 5 },
  passwordStrengthText: { color: "gray" },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
  button: { backgroundColor: "#0d47a1", paddingVertical: 15, borderRadius: 5, marginBottom: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buttonDisabled: { backgroundColor: "gray" },
  link: { textAlign: "center", color: "#0d47a1", fontSize: 14 },
  privacyContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  checkbox: { width: 20, height: 20, borderColor: "gray", borderWidth: 1, marginRight: 10 },
  checkboxChecked: { backgroundColor: "#0d47a1" },
  privacyText: { fontSize: 14 },
  privacyLink: { color: "#0d47a1" },
});

export default LoginScreen;
