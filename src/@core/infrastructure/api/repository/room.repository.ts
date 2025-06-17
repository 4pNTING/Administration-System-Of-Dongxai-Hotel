import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { RoomRepositoryPort } from "@/@core/interface/reposport/room.port";
import { ROOM_QUERY } from "@core/infrastructure/queries/room.query";
import { ROOM_ENDPOINTS } from "../config/endpoints.config";
import { RoomFormData } from "@core/domain/models/rooms/form.model";
import { Room } from "@core/domain/models/rooms/list.model";

export class RoomRepository implements RoomRepositoryPort {
  private readonly URL = ROOM_ENDPOINTS;

  async getMany(): Promise<Room[]> {
    try {
      const query = ROOM_QUERY.LIST.createQuery();
      const response = await api.post<ApiResponse<Room[]>>(this.URL.GET, query);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  async getOne(id: number): Promise<Room> {
    try {
      const query = ROOM_QUERY.DETAIL.createQuery({ RoomId: id });
      const response = await api.post<ApiResponse<Room>>(this.URL.GET, query);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching room details:', error);
      throw error;
    }
  }

  async getAvailable(checkInDate: string, checkOutDate: string): Promise<Room[]> {
    try {
      // ใช้ endpoint AVAILABLE ที่มีอยู่ใน endpoints.config.ts
      const response = await api.get<ApiResponse<Room[]>>(
        `${this.URL.AVAILABLE}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  }

  async create(data: RoomFormData): Promise<Room> {
    try {
      const response = await api.post<ApiResponse<Room>>(this.URL.CREATE, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<RoomFormData>): Promise<Room> {
    try {
      // สร้าง object ใหม่ที่มีเฉพาะฟิลด์ที่จำเป็นสำหรับการอัปเดต
      const updateData = {
        TypeId: data.TypeId,
        StatusId: data.StatusId,
        RoomPrice: data.RoomPrice
      };
      
      console.log('Updating room:', id, 'with data:', updateData);
      
      // เปลี่ยนจาก PUT เป็น PATCH ตาม controller ในฝั่ง backend
      const response = await api.patch<ApiResponse<Room>>(this.URL.UPDATE(id), updateData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete<ApiResponse<void>>(this.URL.DELETE(id));
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
}