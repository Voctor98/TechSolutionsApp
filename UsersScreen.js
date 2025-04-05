// UsersScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal'; // Importa la librería de modal

const UsersScreen = ({ isDarkMode, goBackToHome }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visiblePasswords, setVisiblePasswords] = useState({}); // Objeto para rastrear qué contraseñas son visibles
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const storedUsers = await AsyncStorage.getItem('users');
                if (storedUsers) {
                    setUsers(JSON.parse(storedUsers));
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Could not load user data.");
                // Usaremos el modal de error en lugar de la alerta nativa aquí también
                setErrorMessage(error.message || "No se pudieron cargar los datos de usuario.");
                setErrorModalVisible(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (emailToDelete) => {
        try {
            const existingUsers = await AsyncStorage.getItem('users');
            let users = existingUsers ? JSON.parse(existingUsers) : [];

            users = users.filter(user => user.email !== emailToDelete);

            await AsyncStorage.setItem('users', JSON.stringify(users));

            setUsers(users);

            // Mostrar modal de éxito
            setSuccessMessage("Usuario eliminado correctamente.");
            setSuccessModalVisible(true);
        } catch (error) {
            console.error("Error deleting user:", error);
            setErrorMessage("No se pudo eliminar el usuario.");
            setErrorModalVisible(true);
        } finally {
            setDeleteModalVisible(false);
            setUserToDelete(null);
        }
    };

    const confirmDelete = (email) => {
        setUserToDelete(email);
        setDeleteModalVisible(true);
    };

    const togglePasswordVisibility = (email) => {
        setVisiblePasswords(prevState => ({
            ...prevState,
            [email]: !prevState[email],
        }));
    };

    const handleConfirmDelete = () => {
        deleteUser(userToDelete);
    };

    const handleCancelDelete = () => {
        setDeleteModalVisible(false);
        setUserToDelete(null);
    };

    // Estados y funciones para modales de éxito y error
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const closeSuccessModal = () => setSuccessModalVisible(false);
    const closeErrorModal = () => setErrorModalVisible(false);

    const renderUserItem = ({ item }) => (
        <TouchableOpacity onPress={() => togglePasswordVisibility(item.email)} style={[styles.userItem, isDarkMode && styles.darkUserItem]}>
            <Image
                source={require('./assets/profile-placeholder.png')}
                style={styles.userImage}
            />
            <View style={styles.userInfo}>
                <Text style={[styles.email, isDarkMode && styles.darkEmail]}>{item.email}</Text>
                <Text style={[styles.passwordPlaceholder, isDarkMode && styles.darkPasswordPlaceholder]}>
                    {visiblePasswords[item.email] ? item.password : '••••••••'}
                </Text>
            </View>
            <TouchableOpacity onPress={() => confirmDelete(item.email)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color={isDarkMode ? "#F44336" : "#757575"} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <View style={[styles.header, isDarkMode && styles.darkHeader]}>
                <TouchableOpacity style={styles.backButton} onPress={goBackToHome}>
                    <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#E0E0E0" : "#546E7A"} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>Usuarios</Text>
            </View>

            {isLoading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={isDarkMode ? "#E0E0E0" : "#546E7A"} />
                </View>
            ) : error ? (
                <Text style={[styles.error, isDarkMode && styles.darkError]}>{error}</Text>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={[styles.emptyListText, isDarkMode && styles.darkEmptyListText]}>No hay usuarios registrados.</Text>}
                />
            )}

            {/* Modal de confirmación de eliminación */}
            <Modal isVisible={isDeleteModalVisible}>
                <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
                    <Text style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}>Confirmar eliminación</Text>
                    <Text style={[styles.modalText, isDarkMode && styles.darkModalText]}>¿Estás seguro de que quieres eliminar a este usuario?</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancelDelete}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirmDelete}>
                            <Text style={styles.confirmButtonText}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de éxito */}
            <Modal isVisible={successModalVisible} onBackdropPress={closeSuccessModal}>
                <View style={[styles.modalContainer, styles.successModal, isDarkMode && styles.darkModalContainer]}>
                    <Ionicons name="checkmark-circle-outline" size={50} color="#28a745" />
                    <Text style={[styles.modalTitle, styles.successTitle, isDarkMode && styles.darkModalTitle]}>{successMessage}</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={closeSuccessModal}>
                        <Text style={styles.confirmButtonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal de error */}
            <Modal isVisible={errorModalVisible} onBackdropPress={closeErrorModal}>
                <View style={[styles.modalContainer, styles.errorModal, isDarkMode && styles.darkModalContainer]}>
                    <Ionicons name="alert-circle-outline" size={50} color="#dc3545" />
                    <Text style={[styles.modalTitle, styles.errorTitle, isDarkMode && styles.darkModalTitle]}>{errorMessage}</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={closeErrorModal}>
                        <Text style={styles.confirmButtonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA', // Very light grey
    },
    darkContainer: {
        backgroundColor: '#212121', // Dark grey
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 55,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 0, // Removed shadow for a flatter look
        position: 'relative',
        justifyContent: 'center',
    },
    darkHeader: {
        backgroundColor: '#303030',
        borderBottomColor: '#424242',
    },
    backButton: {
        padding: 10,
        position: 'absolute',
        left: 15,
        top: 55,
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#424242',
        textAlign: 'center',
        flex: 1,
    },
    darkHeaderTitle: {
        color: '#F5F5F5',
    },
    list: {
        flex: 1,
        paddingHorizontal: 15,
    },
    listContent: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    userItem: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    darkUserItem: {
        backgroundColor: '#303030',
        borderColor: '#424242',
    },
    userImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    email: {
        fontSize: 16,
        color: '#212121',
        marginBottom: 2,
    },
    darkEmail: {
        color: '#E0E0E0',
    },
    passwordPlaceholder: {
        fontSize: 14,
        color: '#757575',
    },
    darkPasswordPlaceholder: {
        color: '#BDBDBD',
    },
    deleteButton: {
        padding: 8,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        fontSize: 16,
        color: '#D32F2F',
        textAlign: 'center',
        marginTop: 20,
    },
    darkError: {
        color: '#EF9A9A',
    },
    emptyListText: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        marginTop: 30,
    },
    darkEmptyListText: {
        color: '#BDBDBD',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 8,
        alignItems: 'center',
    },
    darkModalContainer: {
        backgroundColor: '#333',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    darkModalTitle: {
        color: '#eee',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#555',
    },
    darkModalText: {
        color: '#ccc',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#ddd',
    },
    cancelButtonText: {
        color: '#555',
    },
    confirmButton: {
        backgroundColor: '#007bff', // Un azul más profesional
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    successModal: {
        backgroundColor: 'white',
    },
    successTitle: {
        color: '#28a745',
        marginTop: 10,
    },
    errorModal: {
        backgroundColor: 'white',
    },
    errorTitle: {
        color: '#dc3545',
        marginTop: 10,
    },
});

export default UsersScreen;