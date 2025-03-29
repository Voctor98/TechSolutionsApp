import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput, // Importar TextInput para formularios
  Alert,      // Importar Alert para confirmaciones
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const INITIAL_PRODUCTS = [
  {
    id: '1', // ID único
    name: 'Monitor Dell UltraSharp U2718Q',
    description: 'Este monitor cuenta con tecnología HDR...',
    imageSource: require('./assets/product1.jpg'), // Mantener require por simplicidad
  },
  {
    id: '2',
    name: 'Mouse Logitech G203',
    description: 'El Logitech G203 es un ratón para gaming...',
    imageSource: require('./assets/product2.jpg'),
  },
  {
    id: '3',
    name: 'Samsung Galaxy S21',
    description: 'Cuenta con una pantalla Dynamic AMOLED 2X...',
    imageSource: require('./assets/product3.jpg'),
  },
];

// --- Componente HomeScreen ---
const HomeScreen = ({ onLogout, isDarkMode, onNavigateToUsers }) => {
  const [showInventory, setShowInventory] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS); // Estado para la lista de productos
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto para ver/editar
  const [modalMode, setModalMode] = useState('view'); // 'view', 'add', 'edit'
  
  // Estado para los campos del formulario (usado para add/edit)
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  // Para la imagen, en este ejemplo simple, no permitiremos cambiarla fácilmente
  // desde el formulario. Se podría añadir un selector o campo de URL.

  const toggleInventory = () => {
    setShowInventory(!showInventory);
  };

  // --- Funciones para Abrir el Modal ---
  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalMode('view'); // Modo vista por defecto al seleccionar
    setModalVisible(true);
  };

  const openAddModal = () => {
    setSelectedProduct(null); // Limpiar selección previa
    setProductName(''); // Resetear campos del formulario
    setProductDescription('');
    setModalMode('add');
    setModalVisible(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setProductName(product.name); // Precargar campos con datos actuales
    setProductDescription(product.description);
    setModalMode('edit');
    setModalVisible(true); // Modal ya debería estar visible, pero aseguramos
  };

  // --- Función para Cerrar el Modal ---
  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null); // Limpiar selección
    setModalMode('view'); // Resetear modo
    // Resetear campos del formulario
    setProductName('');
    setProductDescription('');
  };

  // --- Funciones CRUD ---
  const handleAddProduct = () => {
    if (!productName || !productDescription) {
      Alert.alert('Error', 'Por favor, completa nombre y descripción.');
      return;
    }
    const newProduct = {
      // Generar un ID simple (en una app real, usar UUID o ID de backend)
      id: Date.now().toString(), 
      name: productName,
      description: productDescription,
      // Asignar una imagen por defecto o permitir selección (simplificado aquí)
      imageSource: require('./assets/profile-placeholder.png'), // Placeholder
    };
    setProducts([...products, newProduct]); // Añadir al estado
    closeModal(); // Cerrar modal
  };

  const handleUpdateProduct = () => {
     if (!productName || !productDescription || !selectedProduct) {
      Alert.alert('Error', 'Datos incompletos para actualizar.');
      return;
    }
    setProducts(
      products.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, name: productName, description: productDescription } // Actualizar solo nombre/descripción
          : p
      )
    );
    closeModal();
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert( // Confirmación antes de borrar
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            setProducts(products.filter((p) => p.id !== productId));
            closeModal(); // Cierra el modal después de eliminar
          },
          style: 'destructive',
        },
      ]
    );
  };


  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* ... (Sección de Perfil y Botón Usuarios - sin cambios) ... */}
      <View style={[styles.profileSection, isDarkMode && styles.darkProfileSection]}>
       <Image
         source={require('./assets/profile-placeholder.png')}
         style={styles.profileImage}
       />
       <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>Te damos la bienvenida</Text>
     </View>

     <View style={styles.contentArea}>
       <FeatureCard
         title="Productos"
         description="Gestiona tus productos electrónicos." // Texto actualizado
         isDarkMode={isDarkMode}
         iconName="basket-outline"
         onPress={toggleInventory}
       />
       
       <TouchableOpacity style={[styles.viewUsersButton, isDarkMode && styles.darkButton]} onPress={onNavigateToUsers}>
         <Text style={[styles.viewUsersButtonText, isDarkMode && styles.darkText]}>Ver usuarios registrados</Text>
       </TouchableOpacity>
     </View>

      {/* --- Sección de Inventario --- */}
      {showInventory && (
        <View style={styles.inventoryContainer}>
          <View style={styles.inventoryHeader}>
            <Text style={[styles.inventoryTitle, isDarkMode && styles.darkText]}>Inventario</Text>
            {/* Botón para Agregar Producto */}
            <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
              <Ionicons name="add-circle" size={30} color="#2ecc71" />
            </TouchableOpacity>
          </View>

          {/* Mapeo de la lista de productos del estado */}
          <View style={styles.productList}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id} // ¡Key es importante para listas!
                  name={product.name}
                  imageSource={product.imageSource} // Pasar la fuente de imagen
                  // onPress ya no necesita pasar los detalles, solo el objeto producto
                  onPress={() => handleProductPress(product)}
                  // No mostrar descripción completa en la tarjeta pequeña
                />
              ))
            ) : (
              <Text style={isDarkMode ? styles.darkText : null}>No hay productos para mostrar.</Text>
            )}
          </View>
        </View>
      )}

      {/* ... (Botón Salir - sin cambios) ... */}
       <TouchableOpacity style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={24} color={isDarkMode ? "black" : "white"} />
        <Text style={[styles.logoutButtonText, isDarkMode && styles.darkLogoutText]}>Salir</Text>
       </TouchableOpacity>


      {/* --- Modal Unificado para Ver, Agregar y Editar --- */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
            {/* --- Contenido del Modal --- */}

            {/* --- Modo VISTA --- */}
            {modalMode === 'view' && selectedProduct && (
              <>
                <Image source={selectedProduct.imageSource} style={styles.modalProductImage} resizeMode="contain" />
                <Text style={[styles.modalProductName, isDarkMode && styles.darkText]}>{selectedProduct.name}</Text>
                <Text style={[styles.modalProductDescription, isDarkMode && styles.darkText]}>{selectedProduct.description}</Text>
                <View style={styles.modalActions}>
                  <Button title="Editar" onPress={() => openEditModal(selectedProduct)} color="#3498db" />
                  <Button title="Eliminar" onPress={() => handleDeleteProduct(selectedProduct.id)} color="#e74c3c" />
                  <Button title="Cerrar" onPress={closeModal} color="#95a5a6"/>
                </View>
              </>
            )}

            {/* --- Modo AGREGAR o EDITAR --- */}
            {(modalMode === 'add' || modalMode === 'edit') && (
              <>
                <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
                  {modalMode === 'add' ? 'Agregar Producto' : 'Editar Producto'}
                </Text>
                
                {/* Campo Nombre */}
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Nombre del Producto"
                  placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
                  value={productName}
                  onChangeText={setProductName}
                />

                {/* Campo Descripción */}
                <TextInput
                  style={[styles.input, styles.inputMultiline, isDarkMode && styles.darkInput]}
                  placeholder="Descripción del Producto"
                  placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
                  value={productDescription}
                  onChangeText={setProductDescription}
                  multiline
                />
                
                {/* En un futuro, aquí podrías añadir un selector de imagen */}
                
                <View style={styles.modalActions}>
                  <Button 
                    title={modalMode === 'add' ? 'Agregar' : 'Guardar Cambios'} 
                    onPress={modalMode === 'add' ? handleAddProduct : handleUpdateProduct} 
                    color="#2ecc71"
                  />
                  <Button title="Cancelar" onPress={closeModal} color="#e74c3c" />
                </View>
              </>
            )}
            
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// --- Product Card Component (Ajustado) ---
// Simplificado para no mostrar descripción directamente en la tarjeta
const ProductCard = ({ name, imageSource, onPress }) => (
  <TouchableOpacity style={styles.productCard} onPress={onPress}>
    <Image source={imageSource} style={styles.productImage} resizeMode="contain" />
    <Text style={styles.productName} numberOfLines={2}>{name}</Text> {/* Limitar nombre a 2 líneas */}
  </TouchableOpacity>
);

// --- FeatureCard Component (Sin Cambios) ---
const FeatureCard = ({ title, iconName, description, isDarkMode, onPress }) => (
  <TouchableOpacity style={[styles.card, isDarkMode && styles.darkCard]} onPress={onPress}>
    <Ionicons name={iconName} size={50} color={isDarkMode ? "white" : "#0D47A1"} />
    <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{title}</Text>
    <Text style={[styles.cardDescription, isDarkMode && styles.darkText]}>{description}</Text>
  </TouchableOpacity>
);


// --- Estilos (Añadir/Modificar estilos necesarios) ---
const styles = StyleSheet.create({
  // ... (Estilos existentes: container, darkContainer, profileSection, etc.) ...
  container: {
   flexGrow: 1,
   justifyContent: 'flex-start',
   alignItems: 'center',
   backgroundColor: '#F4F7FC',
   paddingVertical: 20,
  },
  darkContainer: {
   backgroundColor: '#121212',
  },
  profileSection: {
   alignItems: 'center',
   marginBottom: 30,
   marginTop: 20,
  },
  darkProfileSection: {
   backgroundColor: '#1E1E1E',
   padding: 10,
   borderRadius: 15,
   marginBottom: 10
  },
  profileImage: {
   width: 100,
   height: 100,
   borderRadius: 50,
   marginBottom: 10,
  },
  welcomeText: {
   fontSize: 24,
   fontWeight: 'bold',
   color: '#0D47A1',
  },
  darkText: {
   color: '#FFFFFF',
  },
  contentArea: {
   width: '90%',
   alignItems: 'center',
  },
  card: {
   backgroundColor: 'white',
   borderRadius: 15,
   padding: 20,
   marginBottom: 20,
   width: '100%',
   alignItems: 'center',
   shadowColor: "#000",
   shadowOffset: {
    width: 0,
    height: 2,
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 5,
  },
  darkCard: {
   backgroundColor: "#333333",
   shadowColor: "#fff"
  },
  cardTitle: {
   fontSize: 18,
   fontWeight: 'bold',
   marginTop: 10,
   color: '#0D47A1',
  },
  cardDescription: {
   fontSize: 14,
   marginTop: 5,
   textAlign: 'center',
   color: '#666',
  },
  inventoryContainer: {
    marginTop: 20,
    width: '90%',
    backgroundColor: '#f9f9f9', // Un fondo ligeramente diferente
    borderRadius: 15,
    padding: 15, // Ajustar padding
    // alignItems: 'center', // Quitar para que el header se alinee bien
  },
  // Estilo para el header del inventario (título + botón add)
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espacio entre título y botón
    alignItems: 'center',
    marginBottom: 15,
    width: '100%', // Ocupar todo el ancho del contenedor
  },
  inventoryTitle: {
    fontSize: 20, // Un poco más grande
    fontWeight: 'bold',
    color: '#0D47A1',
    // marginBottom: 10, // Quitar margin bottom, ya está en el header
  },
  addButton: {
    // Estilos para el botón de agregar si es necesario
    padding: 5, // Área táctil
  },
  productList: {
    flexDirection: 'row', // Mantener en fila
    flexWrap: 'wrap',     // Permitir que pasen a la siguiente línea
    justifyContent: 'space-around', // Espacio alrededor de los items
    width: '100%',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10, // Un poco menos redondeado
    padding: 10,
    marginBottom: 15,
    width: '46%', // Para que quepan 2 por fila con espacio
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    minHeight: 180, // Altura mínima para consistencia
    justifyContent: 'space-between', // Para que el texto no se pegue a la imagen
  },
  productImage: {
    width: '90%', // Ajustar tamaño imagen
    height: 100, // Altura fija para la imagen
    borderRadius: 5,
    marginBottom: 8, // Espacio bajo la imagen
  },
  productName: {
    fontSize: 14, // Tamaño ajustado
    fontWeight: '600', // Un poco menos bold
    textAlign: 'center',
    color: '#333', // Color más oscuro
  },
  // productDescription YA NO SE USA EN LA TARJETA

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Más oscuro
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 25, // Más padding
    borderRadius: 15,
    alignItems: 'center',
    width: '85%', // Un poco más ancho
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkModalContainer: {
    backgroundColor: '#2a2a2a'
  },
  modalTitle: { // Estilo para título de Agregar/Editar
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0D47A1',
  },
  modalProductImage: {
    width: 180, // Ligeramente más pequeño
    height: 180,
    marginBottom: 15,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Centrar nombre
  },
  modalProductDescription: {
    fontSize: 15, // Ligeramente más pequeño
    color: '#555',
    textAlign: 'center',
    marginBottom: 20, // Más espacio antes de los botones
  },
  modalActions: { // Contenedor para botones del modal
    flexDirection: 'row',
    justifyContent: 'space-around', // Espaciar botones uniformemente
    width: '100%', // Ocupar todo el ancho
    marginTop: 15, // Espacio arriba de los botones
  },
  // Estilos para Inputs del Formulario
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  inputMultiline: {
    height: 100, // Altura para descripción
    textAlignVertical: 'top', // Alinear texto arriba en multilínea
  },
  darkInput: {
    backgroundColor: '#444',
    borderColor: '#666',
    color: 'white',
  },

  logoutButton: {
    flexDirection: 'row',
    backgroundColor: "#0D47A1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#0D47A1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  darkLogoutButton: {
    backgroundColor: "white"
  },
  logoutButtonText: {
    marginLeft: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  darkLogoutText: {
    color: "black"
  },
  viewUsersButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15
  },
  darkButton: {
    backgroundColor: "#3498db",
    shadowColor: "#fff",
  },
  viewUsersButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ... (Asegúrate de incluir TODOS los demás estilos que tenías)
});

export default HomeScreen;