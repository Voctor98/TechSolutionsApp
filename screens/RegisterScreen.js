{!showLogin ? (
    <>
      <Text style={styles.title}>Registrarse</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
        />
      </View>
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            checkPasswordStrength(text);
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordStrengthContainer}>
        <Text style={styles.passwordStrengthText}>{passwordStrength}</Text>
      </View>
      <TouchableOpacity style={styles.privacyContainer} onPress={() => setIsChecked(!isChecked)}>
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]} />
        <Text style={styles.privacyText}>
          Acepto el{" "}
          <Text style={styles.privacyLink} onPress={openPrivacyPolicy}>
            Aviso de Privacidad
          </Text>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, !isChecked && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={!isChecked || isLoading}
      >
        {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.buttonText}>Registrarse</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowLogin(true)}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </>
  ) : null}
  