import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';


// Constantes de estilo
const colors = {
  primary: '#0D47A1',
  primaryDark: '#002E5D',
  secondary: '#64B5F6',
  backgroundLight: '#F4F7FC',
  backgroundDark: '#121212',
  surfaceLight: '#FFFFFF',
  surfaceDark: '#1E1E1E',
  textPrimary: '#212121',
  textSecondary: '#616161',
  textLight: '#FFFFFF',
  success: '#2E7D32',
  warning: '#F9A825',
  error: '#D32F2F',
  admin: '#D32F2F',
  editor: '#F9A825',
  user: '#2E7D32'
};

// Datos de usuarios de ejemplo mejorados
const EXAMPLE_USERS = [
  { 
    id: '1', 
    email: '200249@utags.edu.mx', 
    name: 'Admin Principal', 
    role: 'Admin',
    phone: '4491830065',
    joinDate: '15/03/2022',
    lastLogin: 'Hoy, 09:45'
  },
  { 
    id: '2', 
    email: 'victormendozapalacio@gmail.com', 
    name: 'Admin', 
    role: 'Admin',
    phone: '4491120006',
    joinDate: '20/05/2023',
    lastLogin: 'Ayer, 16:30'
  },
];

const UsersScreen = ({ isDarkMode, goBackToHome, onToggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(EXAMPLE_USERS);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
    }, 2000);
  };

  // Filtrar usuarios según búsqueda
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Obtener color según rol
  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return colors.admin;
      case 'Editor': return colors.warning;
      default: return colors.success;
    }
  };

  // Estadísticas de usuarios
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'Admin').length,
    editors: users.filter(u => u.role === 'Editor').length,
    regular: users.filter(u => u.role === 'Usuario').length
  };



  
  const handleDeleteUser = () => {
    // Mostrar una alerta de confirmación antes de eliminar
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de que deseas eliminar al usuario ${selectedUser.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            console.log('Eliminando usuario', selectedUser);
            // Eliminar el usuario del estado
            setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
            setSelectedUser(null); // Cierra el modal después de eliminar
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={isDarkMode ? colors.textLight : colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBackToHome} style={styles.backButton}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? colors.textLight : colors.primary} 
          />
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>
            Inicio
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onToggleTheme}
          style={[styles.settingsButton, isDarkMode && styles.darkSettingsButton]}
        >
          <Ionicons 
            name={isDarkMode ? "sunny" : "moon"} 
            size={22} 
            color={isDarkMode ? colors.textLight : colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Título y estadísticas */}
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        Gestión de Usuarios
      </Text>
      
      <View style={[styles.statsContainer, isDarkMode && styles.darkStatsContainer]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>
            {userStats.total}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>
            Total
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, {color: colors.admin}]}>
            {userStats.admins}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>
            Admins
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, {color: colors.warning}]}>
            {userStats.editors}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>
            Editores
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, {color: colors.success}]}>
            {userStats.regular}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>
            Usuarios
          </Text>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isDarkMode ? colors.textSecondary : colors.textSecondary} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="Buscar usuarios..."
          placeholderTextColor={isDarkMode ? colors.textSecondary : colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={isDarkMode ? colors.textSecondary : colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Contenido principal */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={isDarkMode ? colors.textLight : colors.primary} 
          />
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
            Cargando usuarios...
          </Text>
        </View>
      ) : filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="people-outline" 
            size={60} 
            color={isDarkMode ? colors.textSecondary : colors.textSecondary} 
          />
          <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
            No se encontraron usuarios
          </Text>
        </View>
      ) : (
        <View style={styles.usersList}>
          {filteredUsers.map(user => (
            <TouchableOpacity 
              key={user.id}
              onPress={() => setSelectedUser(user)}
              style={[styles.userCard, isDarkMode && styles.darkUserCard]}
            >
              <View style={styles.userAvatar}>
                <Ionicons 
                  name="person-circle" 
                  size={40} 
                  color={getRoleColor(user.role)} 
                />
              </View>
              
              <View style={styles.userInfo}>
                <Text style={[styles.userName, isDarkMode && styles.darkText]}>
                  {user.name}
                </Text>
                <Text style={[styles.userEmail, isDarkMode && styles.darkText]}>
                  {user.email}
                </Text>
              </View>
              
              <View style={[styles.roleBadge, {backgroundColor: getRoleColor(user.role)}]}>
                <Text style={styles.roleText}>
                  {user.role}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal de detalles del usuario */}
      <Modal
        visible={!!selectedUser}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedUser(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
                    Detalles del Usuario
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedUser(null)}>
                    <Ionicons 
                      name="close" 
                      size={28} 
                      color={isDarkMode ? colors.textLight : colors.textPrimary} 
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.userDetailRow}>
                  <Ionicons 
                    name="person" 
                    size={24} 
                    color={getRoleColor(selectedUser.role)} 
                  />
                  <View style={styles.userDetailText}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>
                      Nombre
                    </Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
                      {selectedUser.name}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.userDetailRow}>
                  <Ionicons 
                    name="mail" 
                    size={24} 
                    color={getRoleColor(selectedUser.role)} 
                  />
                  <View style={styles.userDetailText}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>
                      Correo electrónico
                    </Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
                      {selectedUser.email}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.userDetailRow}>
                  <Ionicons 
                    name="call" 
                    size={24} 
                    color={getRoleColor(selectedUser.role)} 
                  />
                  <View style={styles.userDetailText}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>
                      Teléfono
                    </Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
                      {selectedUser.phone}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.userDetailRow}>
                  <Ionicons 
                    name="ribbon" 
                    size={24} 
                    color={getRoleColor(selectedUser.role)} 
                  />
                  <View style={styles.userDetailText}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>
                      Rol
                    </Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.darkText, {color: getRoleColor(selectedUser.role)}]}>
                      {selectedUser.role}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.userDetailRow}>
                  <Ionicons 
                    name="calendar" 
                    size={24} 
                    color={getRoleColor(selectedUser.role)} 
                  />
                  <View style={styles.userDetailText}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>
                      Fecha de registro
                    </Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
                      {selectedUser.joinDate}
                    </Text>
                  </View>
                </View>
     
                <View style={styles.modalActions}>                 
                  <TouchableOpacity 
                    style={[styles.actionButton, {backgroundColor: colors.error}]}
                    onPress={handleDeleteUser}
                  >
                    <Text style={styles.actionButtonText}>
                      Eliminar Usuario
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 6,
      paddingTop: 40, // ⬅️ Añadido: espacio superior para que los botones no queden tan arriba
      backgroundColor: colors.backgroundLight,
    },
    darkContainer: {
      backgroundColor: colors.backgroundDark,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      marginTop: 10, // ⬅️ Añadido: espacio entre el borde superior y los botones
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      marginLeft: 8,
      fontSize: 18,
      color: colors.primary,
      fontWeight: '500',
    },
    darkText: {
      color: colors.textLight,
    },
    settingsButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.surfaceLight,
      elevation: 2,
    },
    darkSettingsButton: {
      backgroundColor: colors.surfaceDark,
    },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  darkStatsContainer: {
    backgroundColor: colors.surfaceDark,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    elevation: 1,
  },
  darkSearchContainer: {
    backgroundColor: colors.surfaceDark,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  darkSearchInput: {
    color: colors.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  usersList: {
    marginBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  darkUserCard: {
    backgroundColor: colors.surfaceDark,
  },
  userAvatar: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    margin: 20,
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  darkModalContainer: {
    backgroundColor: colors.surfaceDark,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  userDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userDetailText: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
  },
});

export default UsersScreen;