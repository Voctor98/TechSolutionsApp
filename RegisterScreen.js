// RegisterScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { styles } from './styles';
import { InputField, FormButton, PrivacyPolicyLink } from './CustomComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

// --- Helper Functions ---
const validatePassword = (password) => {
    const minLength = 8; // Puedes ajustar la longitud mínima
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password); // Amplié los caracteres especiales

    const errors = [];
    if (password.length < minLength) errors.push(`Debe tener al menos ${minLength} caracteres.`);
    if (!hasUppercase) errors.push("Debe incluir al menos una mayúscula.");
    if (!hasLowercase) errors.push("Debe incluir al menos una minúscula.");
    if (!hasNumber) errors.push("Debe incluir al menos un número.");
    if (!hasSpecialChar) errors.push("Debe incluir al menos un carácter especial.");

    return errors;
};

const validateEmailFormat = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

// --- Main Component ---
const RegisterScreen = ({ onNavigateToLogin, onRegisterSuccess, isDarkMode }) => {
    // Removed username state
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordErrors, setPasswordErrors] = useState([]); // Estado para los errores de contraseña

    const handleRegister = async () => {
        // Removed username check
        if (!email || !password) {
            Alert.alert("Error", "Por favor, ingresa todos los campos");
            return;
        }
        if (emailError) {
            Alert.alert("Error", "Por favor, ingresa un correo electrónico válido.");
            return;
        }
        const passwordValidationErrors = validatePassword(password);
        if (passwordValidationErrors.length > 0) {
            Alert.alert("Error de Contraseña", passwordValidationErrors.join('\n'));
            return;
        }
        if (!isChecked) {
            Alert.alert("Aviso de privacidad", "Debes aceptar el aviso de privacidad para registrarte.");
            return;
        }
        setIsLoading(true);

        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];

            if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
                Alert.alert("Error", "Este correo electrónico ya está registrado.");
                setIsLoading(false);
                return;
            }

            // Removed username from the user object
            const newUser = { email, password }; // Por ahora seguimos guardando la contraseña (¡recuerda el hashing!)

            users.push(newUser);
            await AsyncStorage.setItem('users', JSON.stringify(users));

            setIsLoading(false);
            onRegisterSuccess();

        } catch (error) {
            console.error("Error saving user data:", error);
            Alert.alert("Error", "Hubo un problema al registrar el usuario.");
        } finally {
            setIsLoading(false);
        }
    };

    const openPrivacyPolicy = () => {
        Alert.alert(
            "Aviso de Privacidad (Resumido)",
            "En TechSolutions, valoramos su privacidad. Este resumen explica cómo manejamos su información en la app [Nombre de la App]:\n\n" +
            "1. Información Recopilada:\n" +
            "   - Al registrarse: Correo electrónico y contraseña.\n" +
            "   - Uso de la App: Datos de uso anónimos para mejoras.\n" +
            "   - Dispositivo: Información básica del dispositivo (modelo, SO) para soporte y compatibilidad. NO recopilamos datos de ubicación.\n\n" +
            "2. Uso de la Información:\n" +
            "   - Para proveer y mejorar la App.\n" +
            "   - Para autenticar su cuenta.\n" +
            "   - Para comunicarnos con usted (puede optar por no recibir ciertas comunicaciones).\n\n" +
            "3. No Compartimos su Información:\n" +
            "   - No vendemos ni compartimos su información personal con terceros para marketing.\n" +
            "   - Podemos compartirla con proveedores de servicios que nos ayudan a operar la App (bajo obligación de confidencialidad).\n" +
            "   - Podemos divulgarla si es requerido por ley.\n\n" +
            "4. Seguridad:\n" +
            "   - Tomamos medidas de seguridad, pero ninguna transmisión por Internet es 100% segura.\n" +
            "   - Proteja su contraseña.\n\n" +
            "5. Sus Derechos:\n" +
            "   - Puede acceder, corregir o eliminar su información. Contáctenos a [techsolutions@info.com].\n\n" +
            "6. Cambios:\n" +
            "   - Este aviso puede cambiar. Le notificaremos de cambios importantes.\n\n" +
            "7. Contacto:\n" +
            "   - Preguntas: [techsolutions@info.com].\n\n" +
            " ", // VERY important if you have a longer version.
            [{ text: "Aceptar", style: "default" }]
        );
    };

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <Animatable.Image
                animation="bounceIn"
                source={require('./assets/login-background.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Animatable.View style={[styles.formContainer, isDarkMode && styles.darkFormContainer]}>
                <Text style={[styles.title, isDarkMode && styles.darkText]}>Registrarse</Text>
                {/* Removed username input field */}
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
                        setPasswordErrors(validatePassword(text)); // Validar al cambiar la contraseña
                    }}
                    isPassword={true}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    isDarkMode={isDarkMode}
                />
                {passwordErrors.length > 0 && (
                    <View style={[styles.passwordErrorsContainer, isDarkMode && styles.darkPasswordErrorsContainer]}>
                        {passwordErrors.map((error, index) => (
                            <Text key={index} style={[styles.errorText, isDarkMode && styles.darkErrorText]}>{error}</Text>
                        ))}
                    </View>
                )}

                <PrivacyPolicyLink isDarkMode={isDarkMode} isChecked={isChecked} setIsChecked={setIsChecked} openPrivacyPolicy={openPrivacyPolicy} />

                <FormButton title="Registrarse" onPress={handleRegister} isDarkMode={isDarkMode} disabled={!isChecked || emailError || passwordErrors.length > 0} isLoading={isLoading} />
                <TouchableOpacity onPress={onNavigateToLogin}>
                    <Text style={[styles.link, isDarkMode && styles.darkText]}>¿Ya tienes cuenta? Inicia sesión</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
};

export default RegisterScreen;
