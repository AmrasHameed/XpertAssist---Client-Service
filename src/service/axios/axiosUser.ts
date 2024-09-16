import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useDispatch } from "react-redux";
import { userLogout } from "../redux/slices/userAuthSlice";


const createAxios = (): AxiosInstance => {
    const axiosUser: AxiosInstance = axios.create({
        baseURL:`${import.meta.env.VITE_BASE_URL}/user`,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    })
    axiosUser.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem('userToken');
            if (token) {
                config.headers.set('Authorization', `Bearer ${token}`);
            }
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );
    axiosUser.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest =  error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if(!refreshToken) {
                localStorage.removeItem('userToken')
                const dispatch = useDispatch()
                dispatch(userLogout())
                window.location.href = '/';
                return Promise.reject(error)
            }
            try {
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {token: refreshToken});
                const newAccessToken = response.data.token;
                const newRefreshToken = response.data.refreshToken;
                localStorage.setItem('userToken', newAccessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                axiosUser.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosUser(originalRequest);
            } catch (error) {
                console.log(error);
                localStorage.removeItem('userToken');
                localStorage.removeItem('refreshToken');
                const dispatch=useDispatch()
                dispatch(userLogout())
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    })
    return axiosUser;
}

export default createAxios;