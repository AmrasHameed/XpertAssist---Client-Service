import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useDispatch } from "react-redux";
import { expertLogout } from "../redux/slices/expertAuthSlice";


const createAxios = (): AxiosInstance => {
    const axiosExpert: AxiosInstance = axios.create({
        baseURL:`${import.meta.env.VITE_BASE_URL}/expert`,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    })
    axiosExpert.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem('expertToken');
            if (token) {
                config.headers.set('Authorization', `Bearer ${token}`);
            }
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );
    axiosExpert.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest =  error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('expertRefreshToken');
            if(!refreshToken) {
                localStorage.removeItem('expertToken')
                const dispatch = useDispatch()
                dispatch(expertLogout())
                window.location.href = '/expert/login';
                return Promise.reject(error)
            }
            try {
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {token: refreshToken});
                const newAccessToken = response.data.accesstoken;
                const newRefreshToken = response.data.refreshToken;
                localStorage.setItem('expertToken', newAccessToken);
                if (newRefreshToken) {
                    localStorage.setItem('expertRefreshToken', newRefreshToken);
                }
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                axiosExpert.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosExpert(originalRequest);
            } catch (error) {
                console.log(error);
                localStorage.removeItem('expertToken');
                localStorage.removeItem('expertRefreshToken');
                const dispatch=useDispatch()
                dispatch(expertLogout())
                window.location.href = '/expert/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    })
    return axiosExpert;
}

export default createAxios;