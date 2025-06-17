import { QueryOptions } from "@core/domain/models/common/api.model";

export const CHECKIN_QUERY = {
  LIST: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "CheckInId", 
        "CheckInDate", 
        "CheckoutDate", 
        "RoomId",
        "BookingId",
        "CustomerId",
        "StaffId",
        "booking.BookingId",
        "booking.BookingDate",
        "booking.CheckinDate",
        "booking.CheckoutDate",
        "booking.StatusId",
        "customer.CustomerId",
        "customer.CustomerName",
        "customer.CustomerTel",
        "staff.StaffId",
        "staff.StaffName",
        "room.RoomId",
        "room.RoomPrice",
        "room.roomType.TypeName",
        "CreatedAt"
      ],
      relations: ["booking", "customer", "staff", "room", "room.roomType", "checkOuts"],
      filter: filter,
      getType: "many"
    })
  },

  DETAIL: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "CheckInId", 
        "CheckInDate", 
        "CheckoutDate", 
        "RoomId",
        "BookingId",
        "CustomerId",
        "StaffId",
        "booking.BookingId",
        "booking.BookingDate",
        "booking.CheckinDate",
        "booking.CheckoutDate",
        "booking.StatusId",
        "customer.CustomerId",
        "customer.CustomerName",
        "customer.CustomerTel",
        "customer.CustomerAddress",
        "staff.StaffId",
        "staff.StaffName",
        "room.RoomId",
        "room.RoomPrice",
        "room.roomType.TypeName",
        "checkOuts.CheckoutId",
        "checkOuts.CheckoutDate",
        "CreatedAt"
      ],
      relations: ["booking", "customer", "staff", "room", "room.roomType", "checkOuts"],
      filter: filter,
      getType: "one"
    })
  },

  BY_CUSTOMER: {
    createQuery: (customerId: number): QueryOptions => ({
      select: [
        "CheckInId", 
        "CheckInDate", 
        "CheckoutDate", 
        "RoomId",
        "BookingId",
        "booking.BookingDate",
        "room.RoomId",
        "room.roomType.TypeName"
      ],
      relations: ["booking", "room", "room.roomType", "checkOuts"],
      filter: { CustomerId: customerId },
      getType: "many"
    })
  },

  BY_BOOKING: {
    createQuery: (bookingId: number): QueryOptions => ({
      select: [
        "CheckInId", 
        "CheckInDate", 
        "CheckoutDate", 
        "RoomId",
        "BookingId",
        "CustomerId",
        "StaffId",
        "booking.BookingId",
        "booking.StatusId",
        "customer.CustomerName",
        "room.RoomId",
        "room.roomType.TypeName"
      ],
      relations: ["booking", "customer", "room", "room.roomType", "checkOuts"],
      filter: { BookingId: bookingId },
      getType: "one"
    })
  }
} as const;