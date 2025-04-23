export interface RoomType {
    TypeId: number;
    TypeName: string;
  }
  
  export interface RoomStatus {
    StatusId: number;
    StatusName: string;
  }
  
  export interface Room {
    RoomId: number;
    TypeId: number;
    StatusId: number;
    RoomPrice: number;
    roomType?: RoomType;
    roomStatus?: RoomStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  }