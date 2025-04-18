import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { getSession, signOut } from 'next-auth/react';

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
    if (response.data && typeof response.data === 'object') {
      return response;
    }
    
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
        // ใช้ NextAuth session แทน Zustand
        const session = await getSession();
        
        if (!session?.user?.refreshToken) {
          // ถ้าไม่มี refresh token ให้ logout
          signOut({ callbackUrl: '/login' });
          return Promise.reject(error);
        }
        
        // ทำการ refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken: session.user.refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.data && response.data.data) {
          const { accessToken } = response.data.data;
          
          // ตั้งค่า token ใหม่ในคำขอเดิม
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          
          // ส่งคำขอเดิมอีกครั้ง
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // ถ้า refresh token ไม่สำเร็จ ให้ logout
        signOut({ callbackUrl: '/login' });
        return Promise.reject(refreshError);
      }
    }
    
    // ถ้าเป็นข้อผิดพลาดอื่นๆ
    return Promise.reject(error);
  }
);

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  async (config) => {
    // ดึง token จาก NextAuth session
    const session = await getSession();
    const accessToken = session?.user?.accessToken;
    
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