// UsersScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const UsersScreen = ({ isDarkMode, goBackToHome }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        Alert.alert("Error", "Could not load user data.");
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

            // Filter out the user to delete
            users = users.filter(user => user.email !== emailToDelete);

            // Save the updated user list
            await AsyncStorage.setItem('users', JSON.stringify(users));

            // Update the state to re-render the list
            setUsers(users);

            Alert.alert("Hecho", "Usuario eliminado correctamente."); // Confirmation
        } catch (error) {
            console.error("Error deleting user:", error);
            Alert.alert("Error", "Could not delete user.");
        }
    };

    const confirmDelete = (email) => {
        Alert.alert(
            "Confirmar eliminar usuario",
            `¿Estás seguro de que quieres eliminar a este usuario? ${email}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => deleteUser(email) }
            ],
            { cancelable: true }
        );
    };


  const renderUserItem = ({ item }) => (
    <View style={[styles.userItem, isDarkMode && styles.darkUserItem]}>
      <Image
        source={require('./assets/profile-placeholder.png')}
        style={styles.userImage}
      />
      <View style={styles.userInfoContainer}>
        <Text style={[styles.userInfo, isDarkMode && styles.darkText]}>
          Email: {item.email}
        </Text>
        {/*  Don't show password!  Only for this example. */}
        <Text style={[styles.userInfo, isDarkMode && styles.darkText, styles.passwordText]}>
          Password: {item.password}
        </Text>
      </View>
      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.email)}>
        <Ionicons name="trash-outline" size={24} color={isDarkMode? "white" : "red"} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header: Back Button and Title */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity style={styles.backButton} onPress={goBackToHome}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "#0D47A1"} />
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Usuarios Registrados</Text>
      </View>

      {/* Content: Loading, Error, or User List */}
      {isLoading ? (
        <ActivityIndicator size="large" color={isDarkMode ? "white" : "#0D47A1"} />
      ) : error ? (
        <Text style={[styles.errorText, isDarkMode && styles.darkText]}>{error}</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.listContainer}
          ListEmptyComponent={<Text style={[styles.noUsersText, isDarkMode && styles.darkText]}>No hay usuarios registrados aun.</Text>}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
    header:{
      flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',  // Center the title
        paddingTop: 50,       // Add top padding for status bar
        paddingBottom: 10,
        paddingHorizontal: 10, //Consistent padding
        borderBottomWidth: 1,  // Add a subtle bottom border
        borderBottomColor: '#ddd', // Light gray border
        position: 'relative',   // For absolute positioning of the back button
    },
  darkHeader:{
      backgroundColor: "#1E1E1E"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
    textAlign: 'center',
      flex: 1
  },
  darkText: {
    color: '#FFFFFF',
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  userItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkUserItem: {
    backgroundColor: "#333333"
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfoContainer: {
    flex: 1,
  },
  userInfo: {
    fontSize: 16,
    color: '#333',
  },
  passwordText: {
    marginTop: 4,
    color: '#888',
  },
  noUsersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
   backButton: {
    padding: 10,
    position: 'absolute',
    left: 10,           // Align to the left
    top: 50,
  },
    darkButton:{
      backgroundColor: "transparent"
    },
    iconContainer:{
      marginLeft: 10
    },
    deleteButton: { // Style for the delete button
        padding: 10,
        //backgroundColor: 'rgba(255, 0, 0, 0.1)', // Light red background
        borderRadius: 5,
        marginLeft: 10
    },
});

export default UsersScreen;