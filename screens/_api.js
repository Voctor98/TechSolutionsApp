const API_URL = "http://192.168.1.93:3000"; // Reemplaza con tu IP local real

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};
