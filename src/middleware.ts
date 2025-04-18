// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLES, RoleType } from "@/@core/constants/role.constant";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;
    
    console.log("Checking permissions for:", pathname);
    console.log("User role:", token?.role);
    
    // แปลง token.role เป็นตัวพิมพ์เล็กและ cast เป็น RoleType
    const userRole = (token?.role || '').toLowerCase() as RoleType;
    
    // ตรวจสอบสิทธิ์ตามบทบาท
    if (pathname.startsWith("/admin") && userRole !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    // แก้ไขโดยใช้ condition แบบอื่นแทน includes
    if (pathname.startsWith("/dashboards") && 
        userRole !== ROLES.ADMIN && 
        userRole !== ROLES.MANAGER && 
        userRole !== ROLES.STAFF) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: [
    "/dashboards/:path*",
    "/admin/:path*",
    "/customers/:path*",
    "/rooms/:path*",
    "/bookings/:path*"
  ]
};