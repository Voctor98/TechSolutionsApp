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
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Limpiar los campos al cambiar entre Login y Registro
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Éxito", "Inicio de sesión exitoso");
      console.log("Usuario autenticado:", userCredential.user);
    } catch (error) {
      Alert.alert("Error", error.message);
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Éxito", "Registro exitoso");
      console.log("Usuario registrado:", userCredential.user);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setIsLoading(false);
  };

  const openPrivacyPolicy = () => {
    Alert.alert(
      "Aviso de Privacidad",
      "En TechSolutions, nos comprometemos a proteger tu privacidad. Recopilamos tus datos personales, como nombre, correo electrónico y contraseña, con el fin de proporcionarte un servicio adecuado, como el acceso a tu cuenta y el registro en nuestra plataforma. Estos datos serán tratados de manera confidencial y no serán compartidos con terceros sin tu consentimiento, salvo en los casos permitidos por la ley. Puedes consultar nuestra política completa para obtener más detalles sobre cómo gestionamos tu información.",
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

            {/* Aviso de Privacidad */}
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.2,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#e3f2fd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0d47a1",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#7b8c98",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  link: {
    color: "#0d47a1",
    marginTop: 10,
    textAlign: "center",
  },
  privacyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#0d47a1",
    borderRadius: 3,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#0d47a1",
  },
  privacyText: {
    fontSize: 14,
    color: "#0d47a1",
  },
  privacyLink: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});

export default LoginScreen;
