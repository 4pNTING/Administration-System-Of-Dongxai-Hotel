// src/core/domain/models/bookings/list.model.ts
export interface Booking {
  BookingId: number;
  BookingDate: Date | string;
  CheckinDate: Date | string;
  CheckoutDate: Date | string;
  StatusId: number;
  CustomerId: number;
  StaffId: number;
  RoomId: number;
  CreatedAt?: Date | string;
  UpdatedAt?: Date | string;
  
  // Relations - if needed
  customer?: {
    CustomerId: number;
    CustomerName: string;
    CustomerGender?: string;
    CustomerTel?: number;
    CustomerAddress?: string;
    CustomerPostcode?: number;
  };
  staff?: {
    StaffId: number;
    StaffName: string;
    // อื่นๆ ตามต้องการ
  };
  room?: {
    RoomId: number;
    RoomPrice: number;
    roomType?: {
      TypeId: number;
      TypeName: string;
    }
    // อื่นๆ ตามต้องการ
  };
  bookingStatus?: {
    StatusId: number;
    StatusName: string;
    StatusDescription?: string;
  };
}