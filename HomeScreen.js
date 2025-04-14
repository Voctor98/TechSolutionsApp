import React, { useState, useEffect } from 'react';
import {
    View,Text,StyleSheet,Button,Image,ScrollView,TouchableOpacity,Modal,TextInput,Alert,Platform} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Constantes de Estilo ---
const primary = '#0D47A1';
const primaryDark = '#002E5D';
const secondary = '#64B5F6';
const backgroundLight = '#F4F7FC';
const backgroundDark = '#121212';
const surfaceLight = '#FFFFFF';
const surfaceDark = '#1E1E1E';
const textPrimary = '#212121';
const textSecondary = '#616161';
const textLight = '#FFFFFF';
const shadowColor = '#000';
const lightBorder = '#E0E0E0';
const darkBorder = '#424242';
const success = '#2E7D32';
const warning = '#F9A825';
const error = '#D32F2F';

const baseShadow = {
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
};
const cardShadow = {
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
};
const productShadow = {
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
};
const modalShadow = {
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
};

// --- Datos Iniciales ---
const INITIAL_PRODUCTS = [
    { id: '1', name: 'Monitor Dell UltraSharp U2718Q', description: 'Este monitor cuenta con tecnología HDR...', imageSource: require('./assets/product1.jpg')},
    { id: '2', name: 'Mouse Logitech G203', description: 'El Logitech G203 es un ratón para gaming...', imageSource: require('./assets/product2.jpg')},
    { id: '3', name: 'Samsung Galaxy S21', description: 'Cuenta con una pantalla Dynamic AMOLED 2X...', imageSource: require('./assets/product3.jpg')},
];
const PLACEHOLDER_IMAGE = require('./assets/profile-placeholder.png');
const PRODUCTS_STORAGE_KEY = 'products';

// --- Componente HomeScreen ---
const HomeScreen = ({ onLogout, isDarkMode, onNavigateToUsers, onToggleTheme }) => {
    const [showInventory, setShowInventory] = useState(false);
    const [products, setProducts] = useState([]);
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
        if (products.length > 0 && JSON.stringify(products) !== JSON.stringify(INITIAL_PRODUCTS)) {
           saveProducts();
        }
    }, [products]);

    const loadProducts = async () => {
        try {
            const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
            if (storedProducts) {
                const loadedProducts = JSON.parse(storedProducts).map(p => ({
                    ...p,
                    imageSource: typeof p.imageSource === 'number' ? p.imageSource :
                                   (p.imageSource && p.imageSource.uri) ? p.imageSource : PLACEHOLDER_IMAGE
                }));
                setProducts(loadedProducts);
            } else {
                setProducts(INITIAL_PRODUCTS);
            }
        } catch (error) {
            console.error('Error loading products from AsyncStorage:', error);
            Alert.alert('Error', 'Hubo un problema al cargar los productos.');
            setProducts(INITIAL_PRODUCTS);
        }
    };

    const saveProducts = async () => {
        try {
            const productsToSave = products.filter(p => p && p.id);
            await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsToSave));
        } catch (error) {
            console.error('Error saving products to AsyncStorage:', error);
            Alert.alert('Error', 'Hubo un problema al guardar los productos.');
        }
    };

    const pickImageFromLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos.');
          return;
        }
        try {
            let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
            if (!result.canceled && result.assets && result.assets.length > 0) { setProductImageUri(result.assets[0].uri); }
        } catch (error) { console.error("Error al abrir galería:", error); Alert.alert('Error', 'No se pudo abrir la galería.'); }
    };

    const takeImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a la cámara.');
          return;
        }
        try {
            let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
            if (!result.canceled && result.assets && result.assets.length > 0) { setProductImageUri(result.assets[0].uri); }
        } catch (error) { console.error("Error al abrir cámara:", error); Alert.alert('Error', 'No se pudo abrir la cámara.'); }
    };

    const toggleInventory = () => { setShowInventory(!showInventory); };
    const handleProductPress = (product) => { setSelectedProduct(product); setModalMode('view'); setProductName(''); setProductDescription(''); setProductImageUri(null); setModalVisible(true); };
    const openAddModal = () => { setSelectedProduct(null); setProductName(''); setProductDescription(''); setProductImageUri(null); setModalMode('add'); setModalVisible(true); };
    const openEditModal = (product) => { setSelectedProduct(product); setProductName(product.name); setProductDescription(product.description); setProductImageUri(null); setModalMode('edit'); setModalVisible(true); };
    const closeModal = () => { setModalVisible(false); setSelectedProduct(null); setModalMode('view'); setProductName(''); setProductDescription(''); setProductImageUri(null); };

    const handleAddProduct = () => {
        if (!productName || !productDescription) { Alert.alert('Error', 'Por favor, completa nombre y descripción.'); return; }
        const newProduct = { id: Date.now().toString(), name: productName, description: productDescription, imageSource: productImageUri ? { uri: productImageUri } : PLACEHOLDER_IMAGE };
        setProducts(prevProducts => [...prevProducts, newProduct]);
        Alert.alert( 'Producto Agregado', 'El nuevo producto se ha guardado correctamente.', [{ text: 'OK', onPress: () => closeModal() }] );
    };

    const handleUpdateProduct = () => {
        if (!productName || !productDescription || !selectedProduct) { Alert.alert('Error', 'Datos incompletos para actualizar.'); return; }
        setProducts(prevProducts =>
            prevProducts.map((p) => {
                if (p.id === selectedProduct.id) {
                    const updatedProduct = { ...p, name: productName, description: productDescription };
                    if (productImageUri) { updatedProduct.imageSource = { uri: productImageUri }; }
                    return updatedProduct;
                }
                return p;
            })
        );
        Alert.alert( 'Producto Actualizado', 'Los cambios en el producto se han guardado correctamente.', [{ text: 'OK', onPress: () => closeModal() }] );
    };

    const handleDeleteProduct = (productId) => {
        Alert.alert( 'Confirmar Eliminación', '¿Estás seguro de que quieres eliminar este producto?',
            [ { text: 'Cancelar', style: 'cancel' },
              { text: 'Eliminar', onPress: () => {
                      setProducts(prevProducts => prevProducts.filter((p) => p.id !== productId));
                      if (selectedProduct && selectedProduct.id === productId) { closeModal(); }
                  }, style: 'destructive' } ] );
    };

    const getPreviewImageSource = () => {
        if (productImageUri) { return { uri: productImageUri }; }
        if (modalMode === 'edit' && selectedProduct && selectedProduct.imageSource) { return selectedProduct.imageSource; }
        return PLACEHOLDER_IMAGE;
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
            {/* Botón de Configuración */}
            <TouchableOpacity 
                style={[styles.settingsButton, isDarkMode && styles.darkSettingsButton]}
                onPress={onToggleTheme}
            >
                <Ionicons 
                    name={isDarkMode ? "sunny" : "moon"} 
                    size={24} 
                    color={isDarkMode ? textLight : primaryDark} 
                />
            </TouchableOpacity>

            {/* Sección de Perfil */}
            <View style={[styles.profileSection, isDarkMode && styles.darkProfileSection]}>
                <Image source={require('./assets/profile-placeholder1.png')} style={styles.profileImage} />
                <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>Te damos la bienvenida a TechSolutionsApp</Text>
            </View>

            {/* Área de Contenido */}
            <View style={styles.contentArea}>
                <FeatureCard title="Productos" description="Gestiona tus productos electrónicos." isDarkMode={isDarkMode} iconName="basket-outline" onPress={toggleInventory} />
                <TouchableOpacity style={[styles.viewUsersButton, isDarkMode && styles.darkButton]} onPress={onNavigateToUsers}>
                    <Text style={[styles.viewUsersButtonText, isDarkMode && styles.darkText]}>Ver usuarios registrados</Text>
                </TouchableOpacity>
            </View>

            {/* Sección de Inventario */}
            {showInventory && (
                <View style={[styles.inventoryContainer, isDarkMode && styles.darkInventoryContainer]}>
                    <View style={styles.inventoryHeader}>
                        <Text style={[styles.inventoryTitle, isDarkMode && styles.darkText]}>Inventario</Text>
                        <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
                            <Ionicons name="add-circle" size={30} color={textLight} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.productList}>
                        {products.length > 0 ? (
                            products.map((product) => (
                                product && product.id ? ( <ProductCard key={product.id} name={product.name} imageSource={product.imageSource} onPress={() => handleProductPress(product)} /> ) : null
                            ))
                        ) : ( <Text style={[styles.noProductsText, isDarkMode && styles.darkText]}> No hay productos para mostrar. </Text> )}
                    </View>
                </View>
            )}

            {/* Botón Salir */}
            <TouchableOpacity style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]} onPress={onLogout}>
                <Ionicons name="log-out-outline" size={24} color={isDarkMode ? primaryDark : textLight} />
                <Text style={[styles.logoutButtonText, isDarkMode && {color: primaryDark}]}>Salir</Text>
            </TouchableOpacity>

            {/* Modal Unificado */}
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal} >
                <View style={styles.modalBackground}>
                    <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
                        {/* Modo VISTA */}
                        {modalMode === 'view' && selectedProduct && (
                            <>
                               <Image source={selectedProduct.imageSource || PLACEHOLDER_IMAGE} style={styles.modalProductImage} resizeMode="contain"/>
                               <Text style={[styles.modalProductName, isDarkMode && styles.darkText]}>{selectedProduct.name}</Text>
                               <Text style={[styles.modalProductDescription, isDarkMode && styles.darkText]}>{selectedProduct.description}</Text>
                               <View style={styles.modalActions}>
                                   <Button title="Editar" onPress={() => openEditModal(selectedProduct)} color={primary} />
                                   <Button title="Eliminar" onPress={() => handleDeleteProduct(selectedProduct.id)} color={error} />
                                   <Button title="Cerrar" onPress={closeModal} color={textSecondary}/>
                               </View>
                            </>
                        )}

                        {/* Modo AGREGAR o EDITAR */}
                        {(modalMode === 'add' || modalMode === 'edit') && (
                            <>
                                <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}> {modalMode === 'add' ? 'Agregar Producto' : 'Editar Producto'} </Text>

                                {/* Picker de Imagen */}
                                <View style={styles.imagePickerContainer}>
                                    <Text style={[styles.label, isDarkMode && styles.darkText]}>Imagen:</Text>
                                    <View style={styles.imagePreviewContainer}>
                                        <Image source={getPreviewImageSource()} style={styles.imagePreview} resizeMode="contain" />
                                    </View>
                                    <View style={styles.imageButtonsContainer}>
                                        <Button title="Tomar Foto" onPress={takeImage} color={primary}/>
                                        <Button title="Elegir de Galería" onPress={pickImageFromLibrary} color={secondary} />
                                    </View>
                                </View>

                                {/* Campo Nombre */}
                                <Text style={[styles.label, isDarkMode && styles.darkText]}>Nombre:</Text>
                                <TextInput style={[styles.input, isDarkMode && styles.darkInput]} placeholder="Nombre del Producto" placeholderTextColor={isDarkMode ? '#ccc' : '#999'} value={productName} onChangeText={setProductName} />

                                {/* Campo Descripción */}
                                <Text style={[styles.label, isDarkMode && styles.darkText]}>Descripción:</Text>
                                <TextInput style={[styles.input, styles.inputMultiline, isDarkMode && styles.darkInput]} placeholder="Descripción del Producto" placeholderTextColor={isDarkMode ? '#ccc' : '#999'} value={productDescription} onChangeText={setProductDescription} multiline />

                                {/* Botones de Acción */}
                                <View style={styles.modalActions}>
                                    <Button title={modalMode === 'add' ? 'Agregar' : 'Guardar Cambios'} onPress={modalMode === 'add' ? handleAddProduct : handleUpdateProduct} color={success} />
                                    <Button title="Cancelar" onPress={closeModal} color={error} />
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

// --- Componentes ProductCard y FeatureCard ---
const ProductCard = ({ name, imageSource, onPress }) => {
    const displayName = name || 'Producto';
    const sourceToShow = imageSource || PLACEHOLDER_IMAGE;
    return (
        <TouchableOpacity style={styles.productCard} onPress={onPress}>
            <Image source={sourceToShow} style={styles.productImage} resizeMode="cover" />
            <Text style={styles.productName} numberOfLines={2}>{displayName}</Text>
        </TouchableOpacity>
    );
};

const FeatureCard = ({ title, iconName, description, isDarkMode, onPress }) => (
    <TouchableOpacity style={[styles.card, isDarkMode && styles.darkCard]} onPress={onPress}>
        <Ionicons name={iconName} size={50} color={isDarkMode ? textLight : primary} />
        <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{title}</Text>
        <Text style={[styles.cardDescription, isDarkMode && styles.darkText]}>{description}</Text>
    </TouchableOpacity>
);

// --- Estilos ---
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
    settingsButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: surfaceLight,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        ...baseShadow,
        borderWidth: 1,
        borderColor: lightBorder,
    },
    darkSettingsButton: {
        backgroundColor: surfaceDark,
        borderColor: darkBorder,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 30,
    },
    darkProfileSection: {},
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
        backgroundColor: surfaceLight,
        borderRadius: 15,
        padding: 25,
        ...cardShadow,
        borderWidth: 1,
        borderColor: lightBorder,
    },
    darkInventoryContainer: {
        backgroundColor: surfaceDark,
        borderColor: darkBorder,
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
        fontWeight: '700',
        color: primary,
    },
    addButton: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    productCard: {
        backgroundColor: surfaceLight,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        width: '48%',
        alignItems: 'center',
        ...productShadow,
        minHeight: 220,
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: lightBorder,
    },
    productImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#F5F5F5',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: textPrimary,
        marginBottom: 8,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        backgroundColor: surfaceLight,
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        width: '90%',
        ...modalShadow,
    },
    darkModalContainer: {
        backgroundColor: surfaceDark,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 25,
        color: primary,
        textAlign: 'center',
    },
    modalProductImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
    },
    modalProductName: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
        color: textPrimary,
    },
    modalProductDescription: {
        fontSize: 16,
        color: textSecondary,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 24,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: lightBorder,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: surfaceLight,
    },
    inputMultiline: {
        height: 120,
        textAlignVertical: 'top',
    },
    darkInput: {
        backgroundColor: '#424242',
        borderColor: darkBorder,
        color: textLight,
    },
    label: {
        fontSize: 16,
        color: textPrimary,
        fontWeight: '500',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    imagePickerContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePreviewContainer: {
        borderWidth: 1,
        borderColor: lightBorder,
        borderRadius: 8,
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        overflow: 'hidden',
        marginBottom: 15,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imageButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: primary,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 40,
        ...baseShadow,
        alignSelf: 'center',
    },
    darkLogoutButton: {
        backgroundColor: secondary,
    },
    logoutButtonText: {
        marginLeft: 12,
        color: textLight,
        fontSize: 18,
        fontWeight: '600',
    },
    viewUsersButton: {
        backgroundColor: success,
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 15,
        ...baseShadow,
        alignSelf: 'center',
    },
    viewUsersButtonText: {
        color: textLight,
        fontSize: 18,
        fontWeight: '600',
    },
    noProductsText: {
        width: '100%',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 17,
        color: textSecondary,
        paddingHorizontal: 20,
    },
});

export default HomeScreen;