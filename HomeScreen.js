// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView, TouchableOpacity } from 'react-native'; // Import ScrollView and TouchableOpacity
import { Ionicons } from '@expo/vector-icons'; // For icons

const HomeScreen = ({ onLogout, isDarkMode, onNavigateToUsers }) => { // Add onNavigateToUsers
  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Profile Section (Top) */}
      <View style={[styles.profileSection, isDarkMode && styles.darkProfileSection]}>
        <Image
          source={require('./assets/profile-placeholder.png')} // Replace with your profile image path
          style={styles.profileImage}
        />
        <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>Te damos la bienvenida</Text>
        {/*  You can add more user info here (e.g., email) */}
      </View>

      {/* Main Content Area (Cards) */}
      <View style={styles.contentArea}>
        <FeatureCard
          title="Feature 1"
          description="Explore this amazing feature!"
          isDarkMode={isDarkMode}
          onPress={() => alert('Feature 1 Pressed!')} // Replace with your navigation logic
        />
        <FeatureCard
          title="Feature 2"
          description="Configure your settings."
          isDarkMode={isDarkMode}
          onPress={() => alert('Feature 2 Pressed!')}
        />
         <FeatureCard
          title="Feature 3"
          description="Configure your notifications."
          isDarkMode={isDarkMode}
          onPress={() => alert('Feature 3 Pressed!')}
        />
        {/* Add more FeatureCards as needed */}

        {/* Add the "View Users" button */}
        <TouchableOpacity style={[styles.viewUsersButton, isDarkMode && styles.darkButton]} onPress={onNavigateToUsers}>
          <Text style={[styles.viewUsersButtonText, isDarkMode && styles.darkText]}>Ver usuarios registrados</Text>
        </TouchableOpacity>

      </View>



      {/* Logout Button (Bottom, styled) */}
      <TouchableOpacity style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={24} color={isDarkMode ? "black" : "white"} />
        <Text style={[styles.logoutButtonText, isDarkMode && styles.darkLogoutText]}>Salir</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Feature Card Component (Reusable)
const FeatureCard = ({ title, iconName, description, isDarkMode, onPress }) => (
  <TouchableOpacity style={[styles.card, isDarkMode && styles.darkCard]} onPress={onPress}>
    <Ionicons name={iconName} size={50} color={isDarkMode ? "white" : "#0D47A1"} />
    <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{title}</Text>
    <Text style={[styles.cardDescription, isDarkMode && styles.darkText]}>{description}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Important for ScrollView to work correctly
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center',
    backgroundColor: '#F4F7FC',
    paddingVertical: 20, // Add padding
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  darkProfileSection:{
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make it circular
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
    width: '90%', // Control the width of the content
    alignItems: 'center', // Center cards horizontally
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%', // Cards take full width of the content area
    alignItems: 'center', // Center content within the card
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
    darkCard:{
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
    darkLogoutButton:{
        backgroundColor: "white"
    },
  logoutButtonText: {
    marginLeft: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
    darkLogoutText:{
      color: "black"
    },
  viewUsersButton: {      // Style for the new button
    backgroundColor: '#2ecc71', // Example color
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
});

export default HomeScreen;