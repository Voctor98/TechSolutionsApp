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
  TextInput,
  Alert,
  Platform // Importar Platform para verificar el sistema operativo si es necesario para permisos
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Importar ImagePicker
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

// --- Datos Iniciales (sin cambios por ahora) ---
const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Monitor Dell UltraSharp U2718Q',
    description: 'Este monitor cuenta con tecnología HDR...',
    imageSource: require('./assets/product1.jpg'), // require ID (number)
  },
  {
    id: '2',
    name: 'Mouse Logitech G203',
    description: 'El Logitech G203 es un ratón para gaming...',
    imageSource: require('./assets/product2.jpg'), // require ID (number)
  },
  {
    id: '3',
    name: 'Samsung Galaxy S21',
    description: 'Cuenta con una pantalla Dynamic AMOLED 2X...',
    imageSource: require('./assets/product3.jpg'), // require ID (number)
  },
];
const PLACEHOLDER_IMAGE = require('./assets/profile-placeholder.png'); // Define tu placeholder
const PRODUCTS_STORAGE_KEY = 'products'; // Clave para guardar los productos en AsyncStorage

// --- Componente HomeScreen ---
const HomeScreen = ({ onLogout, isDarkMode, onNavigateToUsers }) => {
  // ... (estados existentes: showInventory, products, modalVisible, selectedProduct, modalMode, productName, productDescription) ...
  const [showInventory, setShowInventory] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');

  // --- NUEVO ESTADO ---
  // Guarda la URI de la imagen seleccionada en el formulario (o null)
  const [productImageUri, setProductImageUri] = useState(null);

  // --- Efecto para cargar los productos al montar el componente ---
  useEffect(() => {
    loadProducts();
  }, []);

  // --- Efecto para guardar los productos cada vez que cambian ---
  useEffect(() => {
    saveProducts();
  }, [products]);

  // --- Función para cargar los productos desde AsyncStorage ---
  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Error loading products from AsyncStorage:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los productos.');
    }
  };

  // --- Función para guardar los productos en AsyncStorage ---
  const saveProducts = async () => {
    try {
      await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to AsyncStorage:', error);
      Alert.alert('Error', 'Hubo un problema al guardar los productos.');
    }
  };

  // --- Función para Seleccionar Imagen ---
  const pickImage = async () => {
    // Pedir permiso para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos.');
      return;
    }

    // Lanzar el selector de imágenes
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo imágenes
      allowsEditing: true, // Permitir recortar/editar
      aspect: [4, 3],       // Proporción (opcional)
      quality: 0.8,         // Calidad (0 a 1)
    });

    // console.log(result); // Para depurar y ver la estructura del resultado

    if (!result.canceled) {
      // En SDK >= 48, la URI está en result.assets[0].uri
      // En SDK < 48, estaba en result.uri
      const selectedUri = result.assets && result.assets.length > 0 ? result.assets[0].uri : result.uri;
      if (selectedUri) {
        setProductImageUri(selectedUri); // Guardar la URI en el estado del formulario
      }
    }
  };


  const toggleInventory = () => {
    setShowInventory(!showInventory);
  };

  // --- Funciones para Abrir el Modal (Ajustadas) ---
  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    // No necesitamos setear productImageUri aquí, se usa solo para add/edit
    setModalVisible(true);
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setProductName('');
    setProductDescription('');
    setProductImageUri(null); // Resetear URI de imagen para nuevo producto
    setModalMode('add');
    setModalVisible(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    // Si el producto existente tiene una URI, mostrarla, si no (es require), mostrar null (o la imagen original via selectedProduct)
    setProductImageUri(typeof product.imageSource === 'object' ? product.imageSource.uri : null);
    setModalMode('edit');
    setModalVisible(true);
  };

  // --- Función para Cerrar el Modal (Ajustada) ---
  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
    setModalMode('view');
    setProductName('');
    setProductDescription('');
    setProductImageUri(null); // Resetear URI al cerrar
  };

  // --- Funciones CRUD (Ajustadas) ---
  const handleAddProduct = () => {
    if (!productName || !productDescription) {
      Alert.alert('Error', 'Por favor, completa nombre y descripción.');
      return;
    }
    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      description: productDescription,
      // Usar la URI seleccionada si existe, si no, usar el placeholder
      imageSource: productImageUri ? { uri: productImageUri } : PLACEHOLDER_IMAGE,
    };
    setProducts([...products, newProduct]);
    closeModal();
  };

  const handleUpdateProduct = () => {
      if (!productName || !productDescription || !selectedProduct) {
      Alert.alert('Error', 'Datos incompletos para actualizar.');
      return;
    }
    setProducts(
      products.map((p) => {
        if (p.id === selectedProduct.id) {
          // Crear el producto actualizado
          const updatedProduct = {
            ...p, // Copiar propiedades existentes
            name: productName,
            description: productDescription,
          };
          // Solo actualizar imageSource si se seleccionó una NUEVA imagen (productImageUri tiene valor)
          if (productImageUri) {
            updatedProduct.imageSource = { uri: productImageUri };
          }
          // Si no se seleccionó nueva imagen (productImageUri es null),
          // se mantiene el p.imageSource original gracias al spread operator (...)
          return updatedProduct;
        }
        return p; // Devolver los otros productos sin cambios
      })
    );
    closeModal();
  };

 const handleDeleteProduct = (productId) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            setProducts(products.filter((p) => p.id !== productId));
            closeModal();
          },
          style: 'destructive',
        },
      ]
    );
  };

  // --- Determinar qué imagen mostrar en la preview del formulario ---
  const getPreviewImageSource = () => {
    // Prioridad 1: Nueva imagen seleccionada en el form (URI)
    if (productImageUri) {
      return { uri: productImageUri };
    }
    // Prioridad 2: Imagen existente del producto que se está editando
    if (modalMode === 'edit' && selectedProduct && selectedProduct.imageSource) {
      // selectedProduct.imageSource puede ser require() o { uri: ... }, Image lo maneja
      return selectedProduct.imageSource;
    }
    // Prioridad 3: Placeholder para modo 'add' o si no hay imagen
    return PLACEHOLDER_IMAGE;
  };


  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* ... (Sección de Perfil, FeatureCard, Botón Usuarios - sin cambios) ... */}
        <View style={[styles.profileSection, isDarkMode && styles.darkProfileSection]}>
          <Image
            source={require('./assets/profile-placeholder.png')}
            style={styles.profileImage}
          />
          <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>Te damos la bienvenida a TechSolutionsApp</Text>
        </View>

        <View style={styles.contentArea}>
          <FeatureCard
            title="Productos"
            description="Gestiona tus productos electrónicos."
            isDarkMode={isDarkMode}
            iconName="basket-outline"
            onPress={toggleInventory}
          />

          <TouchableOpacity style={[styles.viewUsersButton, isDarkMode && styles.darkButton]} onPress={onNavigateToUsers}>
            <Text style={[styles.viewUsersButtonText, isDarkMode && styles.darkText]}>Ver usuarios registrados</Text>
          </TouchableOpacity>
        </View>


      {/* --- Sección de Inventario (sin cambios relevantes en la estructura) --- */}
       {showInventory && (
          <View style={styles.inventoryContainer}>
            <View style={styles.inventoryHeader}>
              <Text style={[styles.inventoryTitle, isDarkMode && styles.darkText]}>Inventario</Text>
              <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
                <Ionicons name="add-circle" size={30} color="#2ecc71" />
              </TouchableOpacity>
            </View>

            <View style={styles.productList}>
              {products.length > 0 ? (
                products.map((product) => (
                    product && product.id ? ( // Check added previously
                     <ProductCard
                      key={product.id}
                      name={product.name}
                      // imageSource puede ser require() o {uri: ...}, ProductCard lo debe manejar
                      imageSource={product.imageSource}
                      onPress={() => handleProductPress(product)}
                    />
                  ) : null
                ))
              ) : (
                <Text style={[styles.noProductsText, isDarkMode && styles.darkText]}>
                  No hay productos para mostrar.
                </Text>
              )}
            </View>
          </View>
        )}

      {/* ... (Botón Salir - sin cambios) ... */}
       <TouchableOpacity style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={24} color={isDarkMode ? "black" : "white"} />
        <Text style={[styles.logoutButtonText, isDarkMode && styles.darkLogoutText]}>Salir</Text>
      </TouchableOpacity>


      {/* --- Modal Unificado (Ajustado para Imagen) --- */}
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
                {/* Image ahora maneja require() o {uri: ...} automáticamente */}
                <Image
                    source={selectedProduct.imageSource || PLACEHOLDER_IMAGE}
                    style={styles.modalProductImage}
                    resizeMode="contain"
                  />
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

                  {/* --- Preview de Imagen y Botón para Seleccionar --- */}
                  <View style={styles.imagePickerContainer}>
                    <Text style={[styles.label, isDarkMode && styles.darkText]}>Imagen:</Text>
                    <TouchableOpacity onPress={pickImage} style={styles.imagePreviewContainer}>
                        <Image
                          source={getPreviewImageSource()} // Usa la función helper
                          style={styles.imagePreview}
                          resizeMode="contain"
                        />
                        <Text style={styles.changeImageText}>Toca para cambiar</Text>
                    </TouchableOpacity>
                  </View>


                {/* Campo Nombre */}
                <Text style={[styles.label, isDarkMode && styles.darkText]}>Nombre:</Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Nombre del Producto"
                  placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
                  value={productName}
                  onChangeText={setProductName}
                />

                {/* Campo Descripción */}
                  <Text style={[styles.label, isDarkMode && styles.darkText]}>Descripción:</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline, isDarkMode && styles.darkInput]}
                  placeholder="Descripción del Producto"
                  placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
                  value={productDescription}
                  onChangeText={setProductDescription}
                  multiline
                />

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

// --- Product Card Component (Asegurarse que maneja ambas fuentes) ---
const ProductCard = ({ name, imageSource, onPress }) => {
  const displayName = name || 'Producto';
  // Image source puede ser require() o { uri: ... }, Image lo maneja
  const sourceToShow = imageSource || PLACEHOLDER_IMAGE; // Mostrar placeholder si no hay imagen

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      <Image source={sourceToShow} style={styles.productImage} resizeMode="contain" />
      <Text style={styles.productName} numberOfLines={2}>{displayName}</Text>
    </TouchableOpacity>
  );
};


// --- FeatureCard Component (Sin Cambios) ---
const FeatureCard = ({ title, iconName, description, isDarkMode, onPress }) => (
  <TouchableOpacity style={[styles.card, isDarkMode && styles.darkCard]} onPress={onPress}>
    <Ionicons name={iconName} size={50} color={isDarkMode ? "white" : "#0D47A1"} />
    <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{title}</Text>
    <Text style={[styles.cardDescription, isDarkMode && styles.darkText]}>{description}</Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
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
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#0D47A1',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginTop: 15,
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  darkCard: {
    backgroundColor: "#333333",
    shadowColor: "#fff",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#0D47A1',
  },
  cardDescription: {
    fontSize: 15,
    marginTop: 5,
    textAlign: 'center',
    color: '#777',
  },
  inventoryContainer: {
    marginTop: 20,
    width: '90%',
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  inventoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  addButton: {
    padding: 8,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    width: '46%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  productImage: {
    width: '90%',
    height: 110,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '85%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  darkModalContainer: {
    backgroundColor: '#2a2a2a',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#0D47A1',
  },
  modalProductImage: {
    width: 190,
    height: 190,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  modalProductName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  modalProductDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 25,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 18,
    fontSize: 16,
  },
  inputMultiline: {
    height: 120,
    textAlignVertical: 'top',
  },
  darkInput: {
    backgroundColor: '#444',
    borderColor: '#666',
    color: 'white',
  },
  label: {
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  imagePickerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  imagePreviewContainer: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  changeImageText: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: "#0D47A1",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
    shadowColor: "#0D47A1",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  darkLogoutButton: {
    backgroundColor: "white",
  },
  logoutButtonText: {
    marginLeft: 12,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  viewUsersButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 20,
  },
  viewUsersButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noProductsText: {
    width: '100%',
    textAlign: 'center',
    marginTop: 25,
    fontSize: 18,
    color: '#777',
  },
});

export default HomeScreen;