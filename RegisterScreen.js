import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, Dimensions, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { styles } from './styles';
import { InputField, FormButton, PrivacyPolicyLink } from './CustomComponents';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';  // Ajusta esta ruta según tu estructura

const { width, height } = Dimensions.get("window");

// --- Helper Functions ---
const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

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
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);

    const handleRegister = async () => {
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            Alert.alert("Éxito", "Usuario registrado correctamente");
            onRegisterSuccess(); // Redirige según tu lógica (ej. a login o home)
        } catch (error) {
            console.error("Firebase registration error:", error);
            let message = "Ocurrió un error al registrar. Intenta nuevamente.";
            if (error.code === 'auth/email-already-in-use') {
                message = "Este correo ya está registrado.";
            } else if (error.code === 'auth/invalid-email') {
                message = "El correo no es válido.";
            } else if (error.code === 'auth/weak-password') {
                message = "La contraseña es muy débil.";
            }
            Alert.alert("Error", message);
        } finally {
            setIsLoading(false);
        }
    };

    const openPrivacyPolicy = () => {
        setIsPrivacyModalVisible(true);
    };

    const closePrivacyPolicy = () => {
        setIsPrivacyModalVisible(false);
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
                        setPasswordErrors(validatePassword(text));
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

                <FormButton
                    title="Registrarse"
                    onPress={handleRegister}
                    isDarkMode={isDarkMode}
                    disabled={!isChecked || emailError || passwordErrors.length > 0}
                    isLoading={isLoading}
                />

                <TouchableOpacity onPress={onNavigateToLogin}>
                    <Text style={[styles.link, isDarkMode && styles.darkText]}>¿Ya tienes cuenta? Inicia sesión</Text>
                </TouchableOpacity>
            </Animatable.View>

            {/* Modal de Aviso de Privacidad */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPrivacyModalVisible}
                onRequestClose={closePrivacyPolicy}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, isDarkMode && styles.darkModalView]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}>Aviso de Privacidad de TechSolutions</Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                **1. Responsable de los datos:** TechSolutions (en adelante, "nosotros" o "la Aplicación"), operada por [Nombre de tu empresa o desarrollador], con domicilio en [Dirección de tu empresa o desarrollador, si aplica], es responsable del tratamiento de sus datos personales.
                            </Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                **2. Datos que recopilamos:** Para crear y gestionar su cuenta en TechSolutions, recopilamos y tratamos los siguientes datos personales:
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - Su dirección de correo electrónico.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - La contraseña que usted elija para acceder a su cuenta.
                                </Text>
                                Podemos recopilar información adicional de forma anónima y agregada sobre el uso de la Aplicación para mejorar nuestros servicios y la experiencia del usuario. Esta información no le identifica personalmente.
                            </Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                **3. Finalidad del tratamiento:** Utilizamos sus datos personales para las siguientes finalidades:
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - Crear y gestionar su cuenta de usuario en TechSolutions.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - Autenticar su acceso a la Aplicación.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - Permitirle utilizar las funcionalidades de la Aplicación, incluyendo la visualización de las características de dispositivos electrónicos.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - Comunicarnos con usted en relación con su cuenta, actualizaciones importantes de la Aplicación, o para responder a sus consultas.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - Analizar de forma anónima y agregada el uso de la Aplicación para mejorar su rendimiento y ofrecer nuevas funcionalidades.
                                </Text>
                            </Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                **4. Base legal del tratamiento:** El tratamiento de sus datos personales se basa en su consentimiento explícito al aceptar este Aviso de Privacidad y en la necesidad de ejecutar el contrato de uso de la Aplicación al registrar su cuenta.
                            </Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                **5. Compartición de datos:** En TechSolutions, nos comprometemos a no compartir su información personal con terceros sin su consentimiento explícito, excepto en las siguientes circunstancias limitadas:
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - Cuando sea requerido por ley o por una orden judicial.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - Con proveedores de servicios que nos asisten en la operación de la Aplicación (por ejemplo, servicios de alojamiento, seguridad), quienes están obligados contractualmente a proteger su información.
                                </Text>
                            </Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                **6. Seguridad de los datos:** Implementamos medidas de seguridad técnicas y organizativas razonables para proteger sus datos personales contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Estas medidas incluyen el cifrado de la información sensible (como contraseñas) y la gestión de accesos a nuestros sistemas.
                            </Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                **7. Sus derechos:** Como usuario de TechSolutions, usted tiene los siguientes derechos con respecto a sus datos personales:
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - **Acceso:** Derecho a confirmar si estamos tratando sus datos personales y a obtener una copia de los mismos.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - **Rectificación:** Derecho a solicitar la corrección de datos personales inexactos o incompletos.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - **Supresión (olvido):** Derecho a solicitar la eliminación de sus datos personales en determinadas circunstancias.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - **Limitación del tratamiento:** Derecho a solicitar la limitación del tratamiento de sus datos personales en determinadas situaciones.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - **Oposición:** Derecho a oponerse al tratamiento de sus datos personales por motivos legítimos.
                                </Text>
                                <Text style={[styles.modalSubText, isDarkMode && styles.darkModalSubText]}>
                                    - **Portabilidad de los datos:** Derecho a recibir sus datos personales en un formato estructurado, de uso común y lectura mecánica, y a transmitirlos a otro responsable del tratamiento.
                                </Text>
                                Para ejercer cualquiera de estos derechos, por favor contáctenos a través de [tu correo electrónico de contacto para temas de privacidad] o mediante la sección de "Contacto" dentro de la Aplicación.
                            </Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                **8. Conservación de los datos:** Conservaremos sus datos personales durante el tiempo necesario para proporcionarle los servicios de la Aplicación y gestionar su cuenta. Una vez que su cuenta sea eliminada, podremos conservar ciertos datos de forma anonimizada y agregada para fines estadísticos y de mejora de la Aplicación.
                            </Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                **9. Cambios en el aviso de privacidad:** Nos reservamos el derecho de modificar este Aviso de Privacidad en cualquier momento para reflejar cambios en nuestras prácticas de información o en la legislación aplicable. Cualquier modificación será publicada en esta sección de la Aplicación y, en caso de cambios significativos, podremos notificarle a través de otros medios (por ejemplo, por correo electrónico). Le recomendamos revisar periódicamente este Aviso de Privacidad para estar informado sobre cómo protegemos su información.
                            </Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                **10. Contacto:** Si tiene alguna pregunta o inquietud sobre este Aviso de Privacidad o sobre el tratamiento de sus datos personales, no dude en ponerse en contacto con nosotros a través de [tu correo electrónico de contacto para temas de privacidad].
                            </Text>
                            <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>
                                Al registrarse en TechSolutions, usted confirma que ha leído y comprendido este Aviso de Privacidad y acepta el tratamiento de sus datos personales de acuerdo con los términos aquí establecidos.
                            </Text>
                        </ScrollView>
                        <TouchableOpacity style={[styles.modalButton, isDarkMode && styles.darkModalButton]} onPress={closePrivacyPolicy}>
                            <Text style={[styles.modalButtonText, isDarkMode && styles.darkModalButtonText]}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default RegisterScreen;