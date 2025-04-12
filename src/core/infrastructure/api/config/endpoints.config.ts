const ENDPOINTS = {
    AUTH: {
        BASE_URL: '/auth' as const,
        get LOGIN() { return `${this.BASE_URL}/login` },
        get REGISTER() { return `${this.BASE_URL}/register` },
        get REFRESH() { return `${this.BASE_URL}/refresh` },
        get LOGOUT() { return `${this.BASE_URL}/logout` }
    },
    CUSTOMER: {
        BASE_URL: '/customers' as const,
        get GET() { return `${this.BASE_URL}/query` },  // ใช้สำหรับค้นหา
        get CREATE() { return this.BASE_URL },  // แก้ไขให้เป็น /customers ตรงๆ
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },  // เพิ่ม DETAIL
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    STAFF: {
        BASE_URL: '/staffs' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return this.BASE_URL },  // แก้ไขเป็น /staffs ตรงๆ
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    ROOM: {
        BASE_URL: '/rooms' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return this.BASE_URL },  // แก้ไขเป็น /rooms ตรงๆ
        get AVAILABLE() { return `${this.BASE_URL}/available` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    ROOM_TYPE: {
        BASE_URL: '/room-types' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return this.BASE_URL },  // แก้ไขเป็น /room-types ตรงๆ
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    BOOKING: {
        BASE_URL: '/bookings' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return this.BASE_URL },  // แก้ไขเป็น /bookings ตรงๆ
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` },
        CHANGE_STATUS: function (id: number, status: string) {
            return `${this.BASE_URL}/${id}/status/${status}`
        }
    },
    PAYMENT: {
        BASE_URL: '/payments' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return this.BASE_URL },  // แก้ไขเป็น /payments ตรงๆ
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        BY_BOOKING: function (bookingId: number) { return `${this.BASE_URL}/booking/${bookingId}` }
    },
    DASHBOARD: {
        BASE_URL: '/dashboard' as const,
        get SUMMARY() { return `${this.BASE_URL}/summary` },
        get REVENUE() { return `${this.BASE_URL}/revenue` },
        get OCCUPANCY() { return `${this.BASE_URL}/occupancy` },
        get BOOKINGS() { return `${this.BASE_URL}/bookings` }
    }
  } as const;
  
  export const {
    AUTH: AUTH_ENDPOINTS,
    CUSTOMER: CUSTOMER_ENDPOINTS,
    STAFF: STAFF_ENDPOINTS,
    ROOM: ROOM_ENDPOINTS,
    ROOM_TYPE: ROOM_TYPE_ENDPOINTS,
    BOOKING: BOOKING_ENDPOINTS,
    PAYMENT: PAYMENT_ENDPOINTS,
    DASHBOARD: DASHBOARD_ENDPOINTS
  } = ENDPOINTS;