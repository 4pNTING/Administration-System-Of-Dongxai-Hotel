// src/presentation/config/app-routes.config.ts

const createRoutes = (baseUrl: string) => ({
  BASE_URL: baseUrl,
  LIST: `${baseUrl}/list`,
  CREATE: `${baseUrl}/create`,
  EDIT: (id: string | number) => `${baseUrl}/edit/${id}`,
  DETAIL: (id: string | number) => `${baseUrl}/detail/${id}`,
});

export const APP_ROUTES = {
  // สำหรับ Staff routes
  DASHBOARD_ROUTE: '/dashboards/crm',
  CUSTOMER_ROUTE: createRoutes('/customers'),
  ROOM_ROUTE: createRoutes('/rooms'),
  ROOM_TYPE_ROUTE: createRoutes('/room-types'),
  BOOKING_ROUTE: createRoutes('/bookings'),
  PAYMENT_ROUTE: createRoutes('/payments'),
  REPORT_ROUTE: {
    BASE_URL: '/reports',
    REVENUE: '/reports/revenue',
    OCCUPANCY: '/reports/occupancy',
    BOOKING: '/reports/booking',
  },
  SETTINGS_ROUTE: '/settings',
  STAFF_ROUTE: createRoutes('/staffs'),
  
  // เพิ่ม Customer routes
  CUSTOMER_HOME: '/home',
  CUSTOMER_BOOKING: {
    BASE_URL: '/my-bookings',
    HISTORY: '/my-bookings/history',
    DETAIL: (id: string | number) => `/my-bookings/detail/${id}`,
  },
  CUSTOMER_BOOK_NOW: '/book-now',
  CUSTOMER_PROFILE: '/profile',
  CUSTOMER_SETTINGS: '/user-settings',
} as const;

export const {
  // Staff routes exports
  DASHBOARD_ROUTE,
  CUSTOMER_ROUTE,
  ROOM_ROUTE,
  ROOM_TYPE_ROUTE,
  BOOKING_ROUTE,
  PAYMENT_ROUTE,
  REPORT_ROUTE,
  SETTINGS_ROUTE,
  STAFF_ROUTE,
  
  // Customer routes exports
  CUSTOMER_HOME,
  CUSTOMER_BOOKING,
  CUSTOMER_BOOK_NOW,
  CUSTOMER_PROFILE,
  CUSTOMER_SETTINGS,
} = APP_ROUTES;