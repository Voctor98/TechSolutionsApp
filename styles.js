// styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FC",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  logo: {
    width: width * 0.7,
    height: height * 0.2,
    marginBottom: 20,
  },
  formContainer: {
    width: width * 0.9,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  darkFormContainer: {
    backgroundColor: "#1E1E1E",
    shadowColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#0D47A1",
  },
  darkText: {
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  darkInputContainer: {
    backgroundColor: "#333333",
  },
  icon: {
    marginRight: 10,
    color: "#0D47A1",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: "#333",
  },
  darkInput: {
    color: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: "#333",
  },
  button: {
    backgroundColor: "#0D47A1",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#0D47A1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
    buttonDisabled: {
    opacity: 0.5, // Reduced opacity for disabled state
  },
  darkButton: {
    backgroundColor: "#3498db",
    shadowColor: "#fff",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    color: "#0D47A1",
    fontSize: 14,
    marginTop: 10,
    fontWeight: "600",
  },
  privacyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
      marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderColor: "#0D47A1",
    borderWidth: 1.5,
    borderRadius: 4,
    marginRight: 10,
  },
  darkCheckbox: {
    borderColor: "white"
  },
  checkboxChecked: {
    backgroundColor: "#0D47A1",
  },
  privacyText: {
    fontSize: 14,
    color: "#333",
  },
  privacyLink: {
    color: "#0D47A1",
    fontWeight: "bold",
  },
  darkPrivacyLink: {
    color: "#3498db"
  },
  passwordStrengthContainer: {
    marginTop: -10,
    marginBottom: 10,
  },
  darkPasswordStrengthContainer: {
      marginBottom: 15
  },
  passwordStrengthText: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold'
  },
  errorText: {
    color: "red",
    marginLeft: 10,
    marginBottom: 5,
    marginTop: -5
  },
  darkErrorText: {
    color: "#e74c3c"
  },
  darkModeButton: {
    flexDirection: "row",
    backgroundColor: "#F0F4F8",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  darkModeButtonText: {
    marginLeft: 10,
    color: "#0D47A1",
    fontSize: 16,
    fontWeight: "bold",
  }
});