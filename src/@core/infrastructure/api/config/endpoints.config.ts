// src/core/infrastructure/api/config/endpoints.config.ts
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
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    STAFF: {
        BASE_URL: '/staff' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    ROOM: {
        BASE_URL: '/rooms' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        get AVAILABLE() { return `${this.BASE_URL}/available` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    ROOM_TYPE: {
        BASE_URL: '/room-types' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    ROOM_STATUS: {
        BASE_URL: '/room-statuses' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    BOOKING: {
        BASE_URL: '/bookings' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` },
        CHANGE_STATUS: function (id: number, status: string) {
            return `${this.BASE_URL}/${id}/status/${status}`
        },
        CONFIRM: function (id: number) { return `${this.BASE_URL}/${id}/confirm` },
        CHECKIN: function (id: number) { return `${this.BASE_URL}/${id}/checkin` },
        CHECKOUT: function (id: number) { return `${this.BASE_URL}/${id}/checkout` },
        CANCEL: (id: number) => `/bookings/${id}/cancel`,
    },

    CHECKIN: {
        BASE_URL: '/check-ins' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` },
        CHANGE_STATUS: function (id: number, status: string) {
            return `${this.BASE_URL}/${id}/status/${status}`
        },
        BY_CUSTOMER: function (customerId: number) { return `${this.BASE_URL}/customer/${customerId}` },
        BY_BOOKING: function (bookingId: number) { return `${this.BASE_URL}/booking/${bookingId}` },
        CHECKOUT: function (id: number) { return `${this.BASE_URL}/${id}/checkout` }
    },
    BOOKING_STATUS: {
        BASE_URL: '/booking-statuses' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    PAYMENT: {
        BASE_URL: '/payments' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
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
    ROOM_STATUS: ROOM_STATUS_ENDPOINTS,
    BOOKING: BOOKING_ENDPOINTS,
    CHECKIN: CHECKIN_ENDPOINTS,
    BOOKING_STATUS: BOOKING_STATUS_ENDPOINTS,
    PAYMENT: PAYMENT_ENDPOINTS,
    DASHBOARD: DASHBOARD_ENDPOINTS
} = ENDPOINTS;