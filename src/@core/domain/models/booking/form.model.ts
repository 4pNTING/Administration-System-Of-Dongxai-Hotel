// src/core/domain/models/bookings/form.model.ts
export interface BookingInput {
  BookingDate: Date;
  RoomId: number;
  CheckinDate: Date;
  CheckoutDate: Date;
  CustomerId: number;
  StaffId: number;
  StatusId: number;
}