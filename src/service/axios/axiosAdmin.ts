import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { store } from '../redux/store';
import { adminLogout } from '../redux/slices/adminAuthSlice';

interface DecodedToken {
  exp?: number;
  id: string;
  role: string;
}

// Function to check if the token has expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp !== undefined ? decodedToken.exp < currentTime : true;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Default to expired on error
  }
};

// Create an instance of axios with interceptors
export const axiosAdmin = () => {
  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/admin`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        if (isTokenExpired(token)) {
          console.log('Token has expired');
          store.dispatch(adminLogout()); 
        } else {
          console.log('Token is still valid');
        }
      } else {
        console.log('No token found');
      }
      return {
        ...config,
        headers: {
          ...(token !== null && { Authorization: `Bearer ${token}` }),
          ...config.headers,
        },
      };
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log(response);
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
