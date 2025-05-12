// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLES, RoleType } from "@/@core/constants/role.constant";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;
    
    console.log("MIDDLEWARE - Checking permissions for:", pathname);
    console.log("MIDDLEWARE - User role:", token?.role);
    
    // แปลง token.role เป็นตัวพิมพ์เล็กและ cast เป็น RoleType
    const userRole = (token?.role || '').toLowerCase() as RoleType;
    
    // ตรวจสอบสิทธิ์ตามบทบาท
    if (pathname.includes("/admin") && userRole !== ROLES.ADMIN) {
      console.log("MIDDLEWARE - Access denied to admin route");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    if (pathname.includes("/dashboards") && 
        userRole !== ROLES.ADMIN && 
        userRole !== ROLES.MANAGER && 
        userRole !== ROLES.STAFF) {
      console.log("MIDDLEWARE - Access denied to staff route");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    // ตรวจสอบเส้นทาง my-bookings สำหรับ customer
    if (pathname.includes("/my-bookings") && userRole !== ROLES.CUSTOMER) {
      console.log("MIDDLEWARE - Access denied to customer route");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

// เลือกเส้นทางที่ต้องการตรวจสอบอย่างเฉพาะเจาะจง
export const config = {
  matcher: [
    "/dashboards/:path*",
    "/admin/:path*",
    "/customers/:path*",
    "/rooms/:path*",
    "/bookings/:path*",
    "/my-bookings/:path*",
    "/profile/:path*"
  ]
};