// styles.js
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const primaryColor = '#0D47A1';
const primaryColorDark = '#3498db';
const secondaryColor = '#E8ECF2';
const textColor = '#333333';
const textDarkColor = '#FFFFFF';
const textSecondaryColor = '#555555';
const textSecondaryDarkColor = '#CCCCCC';
const backgroundColorLight = '#F5F7FA';
const backgroundColorDark = '#121212';
const surfaceColorLight = '#FFFFFF';
const surfaceColorDark = '#1E1E1E';
const inputBackgroundColorLight = '#F0F4F8';
const inputBackgroundColorDark = '#2C2C2C';
const errorColor = '#E53935';
const errorColorDark = '#EF9A9A';
const shadowColorLight = '#000';
const shadowColorDark = '#FFFFFF10';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundColorLight,
    paddingHorizontal: 20,
  },
  darkContainer: {
    backgroundColor: backgroundColorDark,
  },
  logo: {
    width: width * 0.6,
    height: height * 0.18,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    backgroundColor: surfaceColorLight,
    padding: 24,
    borderRadius: 16,
    shadowColor: shadowColorLight,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8, // Increased elevation for a more prominent shadow
  },
  darkFormContainer: {
    backgroundColor: surfaceColorDark,
    shadowColor: shadowColorDark,
  },
  title: {
    fontSize: 30, // Slightly larger title
    fontWeight: '800', // More 강조된 fontWeight
    marginBottom: 32, // Increased marginBottom for better spacing
    textAlign: 'center',
    color: primaryColor,
  },
  darkText: {
    color: textDarkColor,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: inputBackgroundColorLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20, // Slightly increased marginBottom
    height: 52, // Slightly increased height
    borderWidth: 1, // Subtle border
    borderColor: '#CED4DA', // Light grey border
  },
  darkInputContainer: {
    backgroundColor: inputBackgroundColorDark,
    borderColor: '#4A4A4A', // Dark grey border
  },
  icon: {
    marginRight: 14, // Slightly increased marginRight
    color: primaryColor,
    fontSize: 22, // Slightly larger icon
  },
  input: {
    flex: 1,
    fontSize: 17, // Slightly larger font
    color: textColor,
  },
  darkInput: {
    color: textDarkColor,
  },
  passwordInput: {
    flex: 1,
    fontSize: 17,
    color: textColor,
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 18, // Slightly increased padding
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12, // Slightly increased marginTop
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 6 }, // Increased shadow
    shadowOpacity: 0.35, // Slightly increased opacity
    shadowRadius: 8, // Increased radius
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.5, // More noticeable disabled state
  },
  darkButton: {
    backgroundColor: primaryColorDark,
  },
  buttonText: {
    color: textDarkColor,
    fontSize: 18, // Slightly larger font
    fontWeight: '700', // More 강조된 fontWeight
  },
  link: {
    textAlign: 'center',
    color: primaryColor,
    fontSize: 16, // Slightly larger font
    marginTop: 20, // Increased marginTop
    fontWeight: '600',
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14, // Slightly increased marginTop
    marginBottom: 10, // Slightly increased marginBottom
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    padding: 0,
    marginRight: 12, // Slightly increased marginRight
  },
  checkbox: {
    width: 22, // Slightly larger checkbox
    height: 22, // Slightly larger checkbox
    borderRadius: 6, // More rounded
    borderWidth: 2,
    borderColor: primaryColor,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  },
  checkboxText: {
    fontSize: 14,
    color: textSecondaryColor,
  },
  darkCheckboxText: {
    color: textSecondaryDarkColor,
  },
  privacyText: {
    fontSize: 15,
    color: textColor,
  },
  privacyLink: {
    color: primaryColor,
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Added underline for better indication
  },
  darkPrivacyLink: {
    color: primaryColorDark,
    textDecorationLine: 'underline',
  },
  passwordStrengthContainer: {
    marginTop: -8, // Adjusted margin
    marginBottom: 12, // Adjusted margin
  },
  passwordStrengthText: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#777777', // Muted color
  },
  errorText: {
    color: errorColor,
    fontSize: 13,
    marginLeft: 6, // Adjusted margin
    marginBottom: 8, // Adjusted margin
  },
  darkErrorText: {
    color: errorColorDark,
  },
  darkModeButton: {
    flexDirection: 'row',
    backgroundColor: secondaryColor,
    paddingVertical: 14, // Slightly increased padding
    paddingHorizontal: 22, // Slightly increased padding
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16, // Slightly increased marginTop
  },
  darkModeButtonText: {
    marginLeft: 12, // Slightly increased marginLeft
    color: primaryColor,
    fontSize: 17, // Slightly larger font
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 17, // Slightly increased padding
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18, // Slightly increased marginTop
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  googleButtonText: {
    color: textDarkColor,
    fontSize: 18, // Slightly larger font
    fontWeight: '600',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background for modal
  },
  modalView: {
    backgroundColor: surfaceColorLight,
    borderRadius: 20,
    padding: 32, // Increased padding for modal
    width: '90%',
    maxHeight: '85%', // Slightly increased max height
    shadowColor: shadowColorLight,
    shadowOffset: { width: 0, height: 6 }, // Increased shadow for modal
    shadowOpacity: 0.3, // Slightly increased opacity for modal
    shadowRadius: 10, // Increased radius for modal
    elevation: 10, // Increased elevation for modal
  },
  darkModalView: {
    backgroundColor: surfaceColorDark,
  },
  modalTitle: {
    fontSize: 22, // Slightly larger modal title
    fontWeight: '700',
    marginBottom: 20, // Increased marginBottom
    color: textColor,
    textAlign: 'center', // Center align modal title
  },
  darkModalTitle: {
    color: textDarkColor,
  },
  modalText: {
    fontSize: 15,
    lineHeight: 22, // Improved line height
    color: textSecondaryColor,
    marginBottom: 24, // Increased marginBottom
  },
  darkModalText: {
    color: textSecondaryDarkColor,
  },
  modalButton: {
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 14, // Slightly increased padding
    paddingHorizontal: 24, // Slightly increased padding
    alignSelf: 'flex-end',
  },
  darkModalButton: {
    backgroundColor: primaryColorDark,
  },
  modalButtonText: {
    color: textDarkColor,
    fontWeight: '600',
    fontSize: 16,
  },
  privacyPolicyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14, // Slightly increased marginBottom
  },
  privacyPolicyLinkText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  darkPrivacyPolicyLinkText: {
    color: '#42A5F5',
  },
});