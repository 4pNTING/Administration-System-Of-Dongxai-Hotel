export interface CheckIn {
  CheckInId: number;
  CheckInDate: Date | string;
  CheckoutDate: Date | string;
  RoomId: number;
  BookingId: number;
  CustomerId: number;
  StaffId: number;
  CreatedAt?: Date | string;
  
  // Relations
  booking?: {
    BookingId: number;
    BookingDate: Date | string;
    CheckinDate: Date | string;
    CheckoutDate: Date | string;
    StatusId: number;
    CustomerId: number;
    StaffId: number;
    RoomId: number;
    CreatedAt?: Date | string;
  };
  
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
    Gender?: string;
    Tel?: string;
    Address?: string;
    userName?: string;
    Salary?: number;
  };
  
  room?: {
    RoomId: number;
    RoomPrice: number;
    TypeId?: number;
    StatusId?: number;
    roomType?: {
      TypeId: number;
      TypeName: string;
    };
    roomStatus?: {
      StatusId: number;
      StatusName: string;
    };
  };
  
  checkOuts?: Array<{
    CheckoutId: number;
    CheckoutDate: Date | string;
    CheckInId: number;
    RoomId: number;
    StaffId: number;
  }>;
}