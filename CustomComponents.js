// CustomComponents.js

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from './styles';

export const InputField = React.forwardRef(({ iconName, placeholder, value, onChangeText, isPassword, showPassword, setShowPassword, isDarkMode, error }, ref) => (
    <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
      <Ionicons name={iconName} size={20} color={isDarkMode ? "white" : "gray"} style={styles.icon} />
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? "#d3d3d3" : "gray"}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword}
        ref={ref} // Attach the ref
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color={isDarkMode ? "white" : "gray"} />
        </TouchableOpacity>
      )}
    </View>
  ));
  
  export const FormButton = ({ title, onPress, isDarkMode, disabled, isLoading }) => (
    <TouchableOpacity
        style={[styles.button, isDarkMode && styles.darkButton, disabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isDarkMode? "#121212" : "white"} />
      ) : (
        <Text style={[styles.buttonText, isDarkMode && styles.darkText]}>{title}</Text>
      )}
    </TouchableOpacity>
);

export const PrivacyPolicyLink = ({ isDarkMode, isChecked, setIsChecked, openPrivacyPolicy }) => (
    <TouchableOpacity style={styles.privacyContainer} onPress={() => setIsChecked(!isChecked)}>
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked, isDarkMode && styles.darkCheckbox]} />
      <Text style={[styles.privacyText, isDarkMode && styles.darkText]}>
        Acepto el{" "}
        <Text style={[styles.privacyLink, isDarkMode && styles.darkPrivacyLink]} onPress={openPrivacyPolicy}>
          Aviso de Privacidad
        </Text>
      </Text>
    </TouchableOpacity>
  );