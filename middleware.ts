// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ดึง token จาก cookies
  const authToken = request.cookies.get('accessToken')?.value;
  
  // พาธที่ต้องการการยืนยันตัวตน
  const protectedPaths = [
    '/dashboard',
    '/customers',
    '/rooms',
    '/bookings',
  ];
  
  // พาธที่ไม่ต้องการการยืนยันตัวตน
  const publicPaths = [
    '/auth/login',
    '/auth/register',
  ];
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // ถ้าเป็นพาธที่ต้องการการยืนยันตัวตนแต่ไม่มี token
  if (isProtectedPath && !authToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // ถ้ามี token แล้วพยายามเข้าถึงหน้า login
  if (isPublicPath && authToken) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  return NextResponse.next();
}

// กำหนดเส้นทางที่ middleware นี้จะทำงาน
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};