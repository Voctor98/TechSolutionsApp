import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  // Asegúrate de declarar correctamente showLogin aquí
  const [showLogin, setShowLogin] = useState(true);  // Inicialización de showLogin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const emailInputRef = React.useRef();

  // Funciones de validación, manejo de login, etc.
  const handleLogin = () => {
    // Lógica para manejar el login
  };

  const validateEmail = (email) => {
    // Lógica para validar el email
  };

  const checkPasswordStrength = (password) => {
    // Lógica para evaluar la fortaleza de la contraseña
  };

  return (
    <View>
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
      ) : null}
    </View>
  );
};

export default LoginScreen;
