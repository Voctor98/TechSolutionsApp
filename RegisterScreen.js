// RegisterScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, Dimensions } from "react-native"; // Import Image and Dimensions
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import axios from 'axios';
import { styles } from './styles'; // Import styles
import { InputField, FormButton, PrivacyPolicyLink } from './CustomComponents';  // Import custom components

const { width, height } = Dimensions.get("window"); // Get screen dimensions

// --- Helper Functions ---
const checkPasswordStrengthValue = (password) => {
  if (password.length < 6) return "Débil";
  if (password.length < 10) return "Moderada";
  return "Fuerte";
};

const validateEmailFormat = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);


// --- Main Component ---
const RegisterScreen = ({ onNavigateToLogin, isDarkMode }) => { // Receive navigation prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

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
      const response = await axios.post("http://192.168.1.95:3000/register", {
        username,
        email,
        password,
      });

      if (response.data.success) {
        Alert.alert("Éxito", "Registro exitoso");
        console.log("Usuario registrado:", response.data.user);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      Alert.alert("Error", "Hubo un problema al conectarse con el servidor");
    } finally {
      setIsLoading(false);
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
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Add the image here, *before* the form */}
      <Animatable.Image
        animation="bounceIn"
        source={require("./assets/login-background.png")} // Make sure the path is correct
        style={styles.logo}
        resizeMode="contain"
      />
        <Animatable.View style={[styles.formContainer, isDarkMode && styles.darkFormContainer]}>
            <Text style={[styles.title, isDarkMode && styles.darkText]}>Registrarse</Text>
            <InputField
              iconName="person-outline"
              placeholder="Nombre de usuario"
              value={username}
              onChangeText={setUsername}
              isDarkMode={isDarkMode}
            />
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
            />
             {emailError ? <Text style={[styles.errorText, isDarkMode && styles.darkErrorText]}>{emailError}</Text> : null}
            <InputField
              iconName="lock-closed-outline"
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordStrength(checkPasswordStrengthValue(text));
              }}
              isPassword={true}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isDarkMode={isDarkMode}
            />
            <View style={[styles.passwordStrengthContainer, isDarkMode && styles.darkPasswordStrengthContainer]}>
              <Text style={[styles.passwordStrengthText, isDarkMode && styles.darkText]}>{passwordStrength}</Text>
            </View>

            <PrivacyPolicyLink isDarkMode={isDarkMode} isChecked={isChecked} setIsChecked={setIsChecked} openPrivacyPolicy={openPrivacyPolicy}/>

            <FormButton title="Registrarse" onPress={handleRegister} isDarkMode={isDarkMode} disabled={!isChecked} isLoading={isLoading}/>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={[styles.link, isDarkMode && styles.darkText]}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default RegisterScreen;