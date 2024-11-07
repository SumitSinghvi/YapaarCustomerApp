import AsyncStorage from '@react-native-async-storage/async-storage';

// Get token from AsyncStorage
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error fetching token', error);
    return null;
  }
};

// Store token in AsyncStorage
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error storing token', error);
  }
};

// Remove token from AsyncStorage
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing token', error);
  }
};
