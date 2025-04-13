import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importar Firebase Authentication
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Importar Firestore

const UsersListScreen = ({ navigation, isDarkMode }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore y Auth
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersCollection = collection(db, 'users'); // 'users' es la colección de Firestore
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => doc.data());
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };

    // Cargar la lista de usuarios al montar el componente
    loadUsers();
  }, []);

  // Manejar la navegación a la pantalla de detalle del usuario
  const handleUserPress = (user) => {
    navigation.navigate('UserDetails', { userId: user.id });
  };

  // Mostrar la lista de usuarios
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.userItem, isDarkMode && styles.darkUserItem]}
      onPress={() => handleUserPress(item)}
    >
      <Text style={[styles.userName, isDarkMode && styles.darkText]}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        Usuarios Registrados
      </Text>

      {loading ? (
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
          Cargando usuarios...
        </Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.email} // Asegúrate de que `email` es único
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  userItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  userName: {
    fontSize: 18,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  darkText: {
    color: '#fff',
  },
  darkUserItem: {
    backgroundColor: '#444',
  },
});

export default UsersListScreen;
