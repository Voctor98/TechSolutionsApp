// LoginScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import axios from 'axios';
import { styles } from './styles'; // Import the styles

// --- Helper Functions ---
const validateEmailFormat = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

const checkPasswordStrengthValue = (password) => {
  if (password.length < 6) return "Débil";
  if (password.length < 10) return "Moderada";
  return "Fuerte";
};

// --- Custom Components ---
const InputField = React.forwardRef(({ iconName, placeholder, value, onChangeText, isPassword, showPassword, setShowPassword, isDarkMode, error }, ref) => (
  <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
    <Ionicons name={iconName} size={20} color={isDarkMode ? "white" : "gray"} style={styles.icon} />
    <TextInput
      style={[styles.input, isDarkMode && styles.darkInput]}
      placeholder={placeholder}
      placeholderTextColor={isDarkMode ? "#d3d3d3" : "gray"}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={isPassword && !showPassword}
      ref={ref} // Attach the ref
    />
    {isPassword && (
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color={isDarkMode ? "white" : "gray"} />
      </TouchableOpacity>
    )}
  </View>
));

const FormButton = ({ title, onPress, isDarkMode, disabled, isLoading }) => (
    <TouchableOpacity
        style={[styles.button, isDarkMode && styles.darkButton, disabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isDarkMode? "#121212" : "white"} />
      ) : (
        <Text style={[styles.buttonText, isDarkMode && styles.darkText]}>{title}</Text>
      )}
    </TouchableOpacity>
);

const PrivacyPolicyLink = ({ isDarkMode, isChecked, setIsChecked, openPrivacyPolicy }) => (
  <TouchableOpacity style={styles.privacyContainer} onPress={() => setIsChecked(!isChecked)}>
    <View style={[styles.checkbox, isChecked && styles.checkboxChecked, isDarkMode && styles.darkCheckbox]} />
    <Text style={[styles.privacyText, isDarkMode && styles.darkText]}>
      Acepto el{" "}
      <Text style={[styles.privacyLink, isDarkMode && styles.darkPrivacyLink]} onPress={openPrivacyPolicy}>
        Aviso de Privacidad
      </Text>
    </Text>
  </TouchableOpacity>
);


// --- Main Component ---
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (showLogin && emailInputRef.current) {
      emailInputRef.current.focus();
    }
    // Reset form fields when switching between login/register
     setUsername("");
     setEmail("");
     setPassword("");
     setEmailError(""); // Reset error
     setPasswordStrength(""); // Reset strength
     setIsChecked(false); // Reset checkbox

  }, [showLogin]);


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, ingresa todos los campos");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://192.168.1.95:3000/login", {
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
    } finally {
      setIsLoading(false);
    }
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
      const response = await axios.post("http://192.168.1.95:3000/register", {
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

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Animatable.Image
        animation="bounceIn"
        source={require("./assets/login-background.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Animatable.View style={[styles.formContainer, isDarkMode && styles.darkFormContainer]}>
        {showLogin ? (
          <>
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
              ref={emailInputRef} // Pass the ref here
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
            <TouchableOpacity onPress={() => setShowLogin(false)}>
              <Text style={[styles.link, isDarkMode && styles.darkText]}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
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
            <TouchableOpacity onPress={() => setShowLogin(true)}>
              <Text style={[styles.link, isDarkMode && styles.darkText]}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </>
        )}
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