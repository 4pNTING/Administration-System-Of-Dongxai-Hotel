// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_API = process.env.BACKEND_API_URL || 'http://localhost:3000/v1';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await axios.post(`${BACKEND_API}/auth/login`, body);
    
    // สร้าง cookies สำหรับเก็บ token
    const { accessToken, refreshToken, expiresIn } = response.data.data;
    
    // สร้าง response และตั้งค่า cookies
    const res = NextResponse.json({ success: true, data: response.data.data });
    
    // ตั้งค่า cookie สำหรับ token
    res.cookies.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
    });
    
    // เก็บ refresh token ไว้ใน secure cookie
    res.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    return res;
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'Authentication failed' 
      },
      { status: error.response?.status || 500 }
    );
  }
}