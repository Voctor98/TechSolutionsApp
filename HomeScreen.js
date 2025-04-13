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
  Alert, // Asegúrate de que Alert está importado
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Datos Iniciales (sin cambios) ---
const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Monitor Dell UltraSharp U2718Q',
    description: 'Este monitor cuenta con tecnología HDR...',
    imageSource: require('./assets/product1.jpg'),
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
const PLACEHOLDER_IMAGE = require('./assets/profile-placeholder.png');
const PRODUCTS_STORAGE_KEY = 'products';

// --- Componente HomeScreen ---
const HomeScreen = ({ onLogout, isDarkMode, onNavigateToUsers }) => {
  const [showInventory, setShowInventory] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImageUri, setProductImageUri] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Evitar guardar el estado inicial si es el mismo que INITIAL_PRODUCTS
    // Esto previene una escritura innecesaria al inicio si loadProducts no encontró nada.
    // Una comparación profunda podría ser más robusta si INITIAL_PRODUCTS es complejo.
    if (JSON.stringify(products) !== JSON.stringify(INITIAL_PRODUCTS)) {
       saveProducts();
    }
  }, [products]);

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        // Parsear productos y asegurar que imageSource sea correcto
        const loadedProducts = JSON.parse(storedProducts).map(p => ({
          ...p,
          // Si imageSource no tiene 'uri', podría ser un require ID (aunque no se guarda bien así)
          // O si se guardó mal. Asegurémonos de que sea un objeto { uri: ... } si no es un require
          // Esta lógica puede necesitar ajuste dependiendo de cómo guardaste antes
          imageSource: typeof p.imageSource === 'number' ? p.imageSource : // Mantener si es require ID (raro desde storage)
                       (p.imageSource && p.imageSource.uri) ? p.imageSource : PLACEHOLDER_IMAGE // Usar URI o placeholder
        }));
        setProducts(loadedProducts);
      } else {
        // Si no hay nada guardado, usa los productos iniciales
        setProducts(INITIAL_PRODUCTS);
      }
    } catch (error) {
      console.error('Error loading products from AsyncStorage:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los productos.');
       // En caso de error, quizás es mejor empezar con los iniciales
       setProducts(INITIAL_PRODUCTS);
    }
  };

  const saveProducts = async () => {
    try {
      // Solo guardar productos que tienen id (previene guardar null/undefined si algo sale mal)
      const productsToSave = products.filter(p => p && p.id);
      await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsToSave));
    } catch (error) {
      console.error('Error saving products to AsyncStorage:', error);
      Alert.alert('Error', 'Hubo un problema al guardar los productos.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUri = result.assets && result.assets.length > 0 ? result.assets[0].uri : result.uri;
      if (selectedUri) {
        setProductImageUri(selectedUri);
      }
    }
  };

  const toggleInventory = () => {
    setShowInventory(!showInventory);
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setProductName(''); // Resetear campos del form por si acaso
    setProductDescription('');
    setProductImageUri(null);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setProductName('');
    setProductDescription('');
    setProductImageUri(null);
    setModalMode('add');
    setModalVisible(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    // Si la imagen existente es una URI, la ponemos en productImageUri para mostrarla
    // Si es un require(), productImageUri se queda null, y getPreviewImageSource usará selectedProduct.imageSource
    setProductImageUri(product.imageSource && typeof product.imageSource !== 'number' ? product.imageSource.uri : null);
    setModalMode('edit');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    // Es buena práctica resetear todo al cerrar, independientemente del modo
    setSelectedProduct(null);
    setModalMode('view');
    setProductName('');
    setProductDescription('');
    setProductImageUri(null);
  };

  // --- Función AGREGAR con Alerta ---
  const handleAddProduct = () => {
    if (!productName || !productDescription) {
      Alert.alert('Error', 'Por favor, completa nombre y descripción.');
      return;
    }
    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      description: productDescription,
      imageSource: productImageUri ? { uri: productImageUri } : PLACEHOLDER_IMAGE,
    };
    setProducts([...products, newProduct]);

    // --- ALERTA DE ÉXITO ---
    Alert.alert(
      'Producto Agregado',
      'El nuevo producto se ha guardado correctamente.',
      [{ text: 'OK', onPress: () => closeModal() }] // Cierra el modal al presionar OK
    );
    // Ya no llamamos a closeModal() directamente aquí
  };

  // --- Función ACTUALIZAR con Alerta ---
  const handleUpdateProduct = () => {
      if (!productName || !productDescription || !selectedProduct) {
      Alert.alert('Error', 'Datos incompletos para actualizar.');
      return;
    }
    setProducts(
      products.map((p) => {
        if (p.id === selectedProduct.id) {
          const updatedProduct = {
            ...p,
            name: productName,
            description: productDescription,
          };
          // Actualizar imagen SOLO si se seleccionó una NUEVA (productImageUri tiene valor)
          if (productImageUri) {
            updatedProduct.imageSource = { uri: productImageUri };
          }
          // Si no hay productImageUri nuevo, se mantiene la imagen original (p.imageSource)
          return updatedProduct;
        }
        return p;
      })
    );

    // --- ALERTA DE ÉXITO ---
    Alert.alert(
      'Producto Actualizado',
      'Los cambios en el producto se han guardado correctamente.',
      [{ text: 'OK', onPress: () => closeModal() }] // Cierra el modal al presionar OK
    );
    // Ya no llamamos a closeModal() directamente aquí
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
            // Si el modal estaba abierto viendo este producto, cerrarlo también
            if (selectedProduct && selectedProduct.id === productId) {
                 closeModal();
            }
             // Podrías añadir una alerta de éxito de eliminación aquí si quieres
             // Alert.alert('Eliminado', 'El producto ha sido eliminado.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getPreviewImageSource = () => {
    if (productImageUri) {
      return { uri: productImageUri };
    }
    if (modalMode === 'edit' && selectedProduct && selectedProduct.imageSource) {
      return selectedProduct.imageSource; // Puede ser require() o { uri: ... }
    }
    return PLACEHOLDER_IMAGE;
  };

  // --- Estilos (Asumiendo que tienes un objeto styles definido más abajo) ---
  // const styles = StyleSheet.create({ ... }); // Tus estilos aquí

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Sección de Perfil */}
      <View style={[styles.profileSection, isDarkMode && styles.darkProfileSection]}>
        <Image
          source={require('./assets/profile-placeholder.png')} // Asegúrate que esta ruta es correcta
          style={styles.profileImage}
        />
        <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>Te damos la bienvenida a TechSolutionsApp</Text>
      </View>

      {/* Área de Contenido */}
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

      {/* Sección de Inventario */}
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
                  product && product.id ? ( // Verifica que el producto y su id existan
                   <ProductCard
                    key={product.id}
                    name={product.name}
                    imageSource={product.imageSource} // ProductCard debe manejar require y {uri}
                    onPress={() => handleProductPress(product)}
                  />
                ) : null // Ignora productos inválidos en el array
              ))
            ) : (
              <Text style={[styles.noProductsText, isDarkMode && styles.darkText]}>
                No hay productos para mostrar.
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Botón Salir */}
      <TouchableOpacity style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={24} color={isDarkMode ? "black" : "white"} />
        <Text style={[styles.logoutButtonText, isDarkMode && styles.darkLogoutText]}>Salir</Text>
      </TouchableOpacity>

      {/* Modal Unificado */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal} // Permite cerrar con botón atrás en Android
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>

            {/* Modo VISTA */}
            {modalMode === 'view' && selectedProduct && (
              <>
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

            {/* Modo AGREGAR o EDITAR */}
            {(modalMode === 'add' || modalMode === 'edit') && (
              <>
                <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
                  {modalMode === 'add' ? 'Agregar Producto' : 'Editar Producto'}
                </Text>

                {/* Picker de Imagen */}
                <View style={styles.imagePickerContainer}>
                  <Text style={[styles.label, isDarkMode && styles.darkText]}>Imagen:</Text>
                  <TouchableOpacity onPress={pickImage} style={styles.imagePreviewContainer}>
                      <Image
                        source={getPreviewImageSource()}
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

                {/* Botones de Acción */}
                <View style={styles.modalActions}>
                  <Button
                    title={modalMode === 'add' ? 'Agregar' : 'Guardar Cambios'}
                    // Llama a las funciones actualizadas que incluyen la alerta
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

// --- Componente ProductCard (Asegúrate que maneja imageSource correctamente) ---
const ProductCard = ({ name, imageSource, onPress }) => {
  const displayName = name || 'Producto';
  // Si imageSource es null o undefined, usa el placeholder
  const sourceToShow = imageSource || PLACEHOLDER_IMAGE;

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      {/* Image maneja tanto require() como { uri: '...' } */}
      <Image source={sourceToShow} style={styles.productImage} resizeMode="contain" />
      <Text style={styles.productName} numberOfLines={2}>{displayName}</Text>
    </TouchableOpacity>
  );
};

// --- Componente FeatureCard (Sin cambios) ---
const FeatureCard = ({ title, iconName, description, isDarkMode, onPress }) => (
  <TouchableOpacity style={[styles.card, isDarkMode && styles.darkCard]} onPress={onPress}>
    <Ionicons name={iconName} size={50} color={isDarkMode ? "white" : "#0D47A1"} />
    <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{title}</Text>
    <Text style={[styles.cardDescription, isDarkMode && styles.darkText]}>{description}</Text>
  </TouchableOpacity>
);



const primary = '#0D47A1';
const primaryDark = '#002E5D';
const secondary = '#64B5F6';
const backgroundLight = '#F4F7FC';
const backgroundDark = '#121212';
const surfaceLight = '#FFFFFF';
const surfaceDark = '#1E1E1E';
const textPrimary = '#212121'; // Darker primary text
const textSecondary = '#616161'; // Darker secondary text
const textLight = '#FFFFFF';
const shadowColor = '#000';
const lightBorder = '#E0E0E0';
const darkBorder = '#424242';
const success = '#2E7D32'; // Darker success
const warning = '#F9A825'; // More vibrant warning
const error = '#D32F2F';   // Darker error

const baseShadow = {
  shadowColor: shadowColor,
  shadowOffset: { width: 0, height: 1 }, // Subtle base shadow
  shadowOpacity: 0.18,
  shadowRadius: 2,
  elevation: 2,
};

const cardShadow = {
  shadowColor: shadowColor,
  shadowOffset: { width: 0, height: 3 }, // More defined card shadow
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
};

const productShadow = {
  shadowColor: shadowColor,
  shadowOffset: { width: 0, height: 2 }, // Specific product shadow
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
};

const modalShadow = {
  shadowColor: shadowColor,
  shadowOffset: { width: 0, height: 4 }, // Refined modal shadow
  shadowOpacity: 0.22,
  shadowRadius: 8,
  elevation: 5,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: backgroundLight,
    paddingVertical: 30,
  },
  darkContainer: {
    backgroundColor: backgroundDark,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 30,
  },
  darkProfileSection: {
    backgroundColor: surfaceDark,
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 7,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: primary,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: primary,
    marginTop: 20,
  },
  darkText: {
    color: textLight,
  },
  contentArea: {
    width: '95%',
    alignItems: 'center',
  },
  card: {
    backgroundColor: surfaceLight,
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
    width: '100%',
    alignItems: 'center',
    ...cardShadow,
    borderWidth: 1,
    borderColor: lightBorder,
  },
  darkCard: {
    backgroundColor: surfaceDark,
    shadowColor: textLight,
    borderColor: darkBorder,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 15,
    color: primary,
  },
  cardDescription: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    color: textSecondary,
    lineHeight: 24,
  },
  inventoryContainer: {
    marginTop: 30,
    width: '95%',
    backgroundColor: surfaceLight, // Using surfaceLight for better contrast
    borderRadius: 15,
    padding: 25,
    ...cardShadow,
    borderWidth: 1,
    borderColor: lightBorder,
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  inventoryTitle: {
    fontSize: 24,
    fontWeight: '700', // Stronger emphasis
    color: primary,
  },
  addButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: textLight,
    fontSize: 16,
    fontWeight: '500',
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5, // Add some horizontal padding for better spacing
  },
  productCard: {
    backgroundColor: surfaceLight,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    width: '48%',
    alignItems: 'center',
    ...productShadow, // Using specific product shadow
    minHeight: 240, // Slightly taller to accommodate more content
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: lightBorder,
  },
  productImage: {
    width: '90%',
    height: 130, // Increased height
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F5F5F5', // Softer background
    resizeMode: 'cover', // Ensure image fills the container nicely
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    color: textPrimary,
    marginBottom: 5, // Add a little space below the name
  },
  productPrice: {
    fontSize: 16,
    color: success, // Use a distinct color for price
    fontWeight: '500',
    marginBottom: 8,
  },
  productDescriptionShort: {
    fontSize: 14,
    color: textSecondary,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
    height: 40, // Limit height to show a short description
    overflow: 'hidden',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    backgroundColor: surfaceLight,
    padding: 35,
    borderRadius: 15,
    alignItems: 'center',
    width: '90%',
    ...modalShadow,
  },
  darkModalContainer: {
    backgroundColor: surfaceDark,
  },
  modalTitle: {
    fontSize: 26, // Slightly larger modal title
    fontWeight: '700',
    marginBottom: 30,
    color: primary,
    textAlign: 'center',
  },
  modalProductImage: {
    width: 220, // Larger modal image
    height: 220, // Larger modal image
    marginBottom: 25,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    resizeMode: 'contain', // Or 'cover' depending on the desired look
  },
  modalProductName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: textPrimary,
  },
  modalProductDescription: {
    fontSize: 16,
    color: textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: lightBorder,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 22,
    fontSize: 17,
  },
  inputMultiline: {
    height: 140,
    textAlignVertical: 'top',
  },
  darkInput: {
    backgroundColor: '#333',
    borderColor: darkBorder,
    color: textLight,
  },
  label: {
    fontSize: 17,
    color: textPrimary,
    fontWeight: '500',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  imagePickerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,
  },
  imagePreviewContainer: {
    borderWidth: 2,
    borderColor: lightBorder,
    borderRadius: 10,
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: textLight,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: primary,
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
    ...baseShadow,
  },
  darkLogoutButton: {
    backgroundColor: secondary,
  },
  logoutButtonText: {
    marginLeft: 15,
    color: textLight,
    fontSize: 19,
    fontWeight: '600',
  },
  viewUsersButton: {
    backgroundColor: success,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 25,
  },
  viewUsersButtonText: {
    color: textLight,
    fontSize: 19,
    fontWeight: '600',
  },
  noProductsText: {
    width: '100%',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: textSecondary,
  },
});

export default HomeScreen;