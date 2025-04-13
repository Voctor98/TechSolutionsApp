import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { db } from './firebase'; // Asegúrate de importar db
import { collection, getDocs } from 'firebase/firestore'; // Importa los métodos de Firestore

const UsersScreen = ({ isDarkMode, goBackToHome }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users')); // Accede a la colección de usuarios
                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("No se pudieron cargar los datos de usuario.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (idToDelete) => {
        try {
            await db.collection('users').doc(idToDelete).delete(); // Ajusta con la nueva instancia de Firestore
            setUsers(prevUsers => prevUsers.filter(user => user.id !== idToDelete));
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

    const confirmDelete = (id) => {
        setUserToDelete(id);
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
            <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
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
                    keyExtractor={(item) => item.id}
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
        backgroundColor: '#fff',
        paddingTop: 20, // Ajustamos el espacio superior
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        backgroundColor: '#f5f5f5',
        justifyContent: 'flex-start',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    userItem: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    email: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    passwordPlaceholder: {
        color: '#aaa',
    },
    deleteButton: {
        padding: 10,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
    error: {
        textAlign: 'center',
        color: 'red',
        marginTop: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
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
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    confirmButton: {
        backgroundColor: '#28a745',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default UsersScreen;
