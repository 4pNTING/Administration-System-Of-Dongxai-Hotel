import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useAuthStore } from '../../presentation/store/auth.store';

// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1';
const TIMEOUT = 30000;

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // ถ้า response มีฟิลด์ data เป็น object ให้ส่งค่านั้นกลับไป
    // รูปแบบของ response คือ { data: ..., success: true, timestamp: ..., path: ... }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response;
    }
    
    // ถ้าไม่ใช่รูปแบบที่คาดหวัง ส่งข้อมูลทั้งหมดกลับไป
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    
    // ถ้าเกิด 401 Unauthorized และไม่ใช่การพยายาม refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true;
      
      try {
        // ดึง token จาก store
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
          // ถ้าไม่มี refresh token ให้ logout
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
        
        // ทำการ refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.data && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // บันทึก token ใหม่
          useAuthStore.getState().setTokens({
            accessToken,
            refreshToken: newRefreshToken,
          });
          
          // ตั้งค่า token ใหม่ในคำขอเดิม
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          
          // ส่งคำขอเดิมอีกครั้ง
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // ถ้า refresh token ไม่สำเร็จ ให้ logout
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    // ถ้าเป็นข้อผิดพลาดอื่นๆ
    return Promise.reject(error);
  }
);

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    
    // ถ้ามี token ให้เพิ่มในส่วนหัวของคำขอ
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;