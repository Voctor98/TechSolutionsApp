import React, { useState, useEffect } from "react";
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

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
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
      const response = await fetch("http://192.168.1.95:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Éxito", "Registro exitoso");
        console.log("Usuario registrado:", data.user);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al conectarse con el servidor");
    }
    setIsLoading(false);
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
      <Image source={require("./assets/login-background.png")} style={styles.logo} resizeMode="contain" />
      <View style={styles.formContainer}>
        {showLogin ? (
          <>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
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
            <TextInput style={styles.input} placeholder="Nombre de usuario" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
            <TouchableOpacity style={styles.privacyContainer} onPress={() => setIsChecked(!isChecked)}>
              <View style={[styles.checkbox, isChecked && styles.checkboxChecked]} />
              <Text style={styles.privacyText}>
                Acepto el{" "}
                <Text style={styles.privacyLink} onPress={openPrivacyPolicy}>
                  Aviso de Privacidad
                </Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, !isChecked && styles.buttonDisabled]} onPress={handleRegister} disabled={!isChecked || isLoading}>
              {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.buttonText}>Registrarse</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLogin(true)}>
              <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa", paddingHorizontal: 20 },
  logo: { width: width * 0.5, height: height * 0.2, marginBottom: 20 },
  formContainer: { width: "100%", maxWidth: 400, backgroundColor: "#ffffff", padding: 20, borderRadius: 10, shadowColor: "black", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 10 }, elevation: 5 },
  title: { fontSize: 24, fontWeight: "bold", color: "#0d47a1", marginBottom: 20, textAlign: "center" },
  input: { width: "100%", height: 40, backgroundColor: "#e3f2fd", borderRadius: 5, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#0d47a1", padding: 10, borderRadius: 5, marginTop: 10 },
  buttonDisabled: { backgroundColor: "#7b8c98" },
  buttonText: { color: "white", textAlign: "center" },
  link: { color: "#0d47a1", marginTop: 10, textAlign: "center" },
  privacyContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: "#0d47a1", borderRadius: 3, marginRight: 10 },
  checkboxChecked: { backgroundColor: "#0d47a1" },
  privacyText: { fontSize: 14, color: "#0d47a1" },
  privacyLink: { textDecorationLine: "underline", fontWeight: "bold" },
});

export default LoginScreen;
