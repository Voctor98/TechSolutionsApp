import * as Notifications from 'expo-notifications';

// Solicitar permisos para recibir notificaciones
export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications is required!');
  }
};

// Función para enviar una notificación local
export const sendLocalNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: { seconds: 2 }, // Puedes configurar el trigger según tus necesidades
  });
};
