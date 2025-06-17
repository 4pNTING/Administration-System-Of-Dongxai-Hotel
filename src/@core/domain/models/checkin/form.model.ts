// src/core/domain/models/checkin/form.model.ts
export interface CheckInInput {
  CheckInDate: Date;
  CheckoutDate: Date;
  RoomId: number;
  BookingId: number;
  CustomerId: number;
  StaffId: number;
}