// src/presentation/config/app-routes.config.ts

const createRoutes = (baseUrl: string) => ({
    BASE_URL: baseUrl,
    LIST: `${baseUrl}/list`,
    CREATE: `${baseUrl}/create`,
    EDIT: (id: string | number) => `${baseUrl}/edit/${id}`,
    DETAIL: (id: string | number) => `${baseUrl}/detail/${id}`,
  });
  
  const APP_ROUTES = {
    DASHBOARD_ROUTE: '/dashboard',
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
  } as const;
  
  export const {
    DASHBOARD_ROUTE,
    CUSTOMER_ROUTE,
    ROOM_ROUTE,
    ROOM_TYPE_ROUTE,
    BOOKING_ROUTE,
    PAYMENT_ROUTE,
    REPORT_ROUTE,
    SETTINGS_ROUTE,
    STAFF_ROUTE,
  } = APP_ROUTES;