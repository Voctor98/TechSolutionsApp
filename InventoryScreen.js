import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const InventoryScreen = ({ isDarkMode }) => {
  const inventoryItems = [
    { id: 1, name: 'Smartphone', price: '$799' },
    { id: 2, name: 'Laptop', price: '$1199' },
    { id: 3, name: 'Tablet', price: '$499' },
    // Agrega más productos aquí
  ];

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Inventario de Productos</Text>
      {inventoryItems.map((item) => (
        <TouchableOpacity key={item.id} style={styles.itemCard}>
          <Text style={[styles.itemName, isDarkMode && styles.darkText]}>{item.name}</Text>
          <Text style={[styles.itemPrice, isDarkMode && styles.darkText]}>{item.price}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0D47A1',
  },
  darkText: {
    color: '#FFFFFF',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '90%',
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
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
  },
});

export default InventoryScreen;
