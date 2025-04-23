// src/core/domain/models/rooms/list.model.ts
export interface Room {
  RoomId: number;
  TypeId: number;
  StatusId: number;
  RoomPrice: number;
  roomType?: {
    TypeId: number;
    TypeName: string;
  };
  roomStatus?: {
    StatusId: number;
    StatusName: string;
  };
  createdAt?: string;
  updatedAt?: string;
}