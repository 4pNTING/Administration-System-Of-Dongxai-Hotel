// src/core/infrastructure/api/repository/booking.repository.ts
import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { BookingInput } from "@core/domain/models/booking/form.model";
import { Booking } from "@core/domain/models/booking/list.model";
import { BookingRepositoryPort } from "@/@core/interface/reposport/booking.port";
import { BOOKING_ENDPOINTS } from "../config/endpoints.config";
import { BOOKING_QUERY } from "@core/infrastructure/queries/booking.query";

export class BookingRepository implements BookingRepositoryPort {
  private readonly URL = BOOKING_ENDPOINTS;

  async getMany(): Promise<Booking[]> {
    try {
      const query = BOOKING_QUERY.LIST.createQuery();
      const response = await api.post<ApiResponse<Booking[]>>(this.URL.GET, query);
     
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async getOne(id: number): Promise<Booking> {
    try {
      const query = BOOKING_QUERY.DETAIL.createQuery({ BookingId: id });
      const response = await api.post<ApiResponse<Booking>>(this.URL.GET, query);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }

  async create(data: BookingInput): Promise<Booking> {
    try {
      const response = await api.post<ApiResponse<Booking>>(this.URL.CREATE, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<BookingInput>): Promise<Booking> {
    try {
      console.log('Updating booking:', id, 'with data:', data);
      
      // เปลี่ยนจาก PUT เป็น PATCH ตาม controller ในฝั่ง backend
      const response = await api.patch<ApiResponse<Booking>>(this.URL.UPDATE(id), data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete<ApiResponse<void>>(this.URL.DELETE(id));
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // ===== เพิ่ม Methods ใหม่สำหรับ Booking Workflow =====

  async checkin(id: number): Promise<Booking> {
    try {
      console.log('🏨 Repository: Processing check-in for booking ID:', id);
      
      // ใช้ endpoint จาก config
      const response = await api.patch<ApiResponse<Booking>>(this.URL.CHECKIN(id), {});
      
      console.log('✅ Repository: Check-in response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Repository: Error processing check-in:', error);
      throw error;
    }
  }
   async cancel(id: number): Promise<Booking> {
    try {
      console.log('❌ Repository: Processing cancel for booking ID:', id);
      
      // ใช้ endpoint จาก config
      const response = await api.patch<ApiResponse<Booking>>(this.URL.CANCEL(id), {});
      
      console.log('✅ Repository: Cancel response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Repository: Error processing cancel:', error);
      throw error;
    }
  }

  async confirm(id: number): Promise<Booking> {
    try {
      console.log('✔️ Repository: Confirming booking ID:', id);
      
      // ใช้ endpoint จาก config
      const response = await api.patch<ApiResponse<Booking>>(this.URL.CONFIRM(id), {});
      
      console.log('✅ Repository: Confirm response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Repository: Error confirming booking:', error);
      throw error;
    }
  }

  async checkout(id: number): Promise<Booking> {
    try {
      console.log('🚪 Repository: Processing check-out for booking ID:', id);
      
      // ใช้ endpoint จาก config
      const response = await api.patch<ApiResponse<Booking>>(this.URL.CHECKOUT(id), {});
      
      console.log('✅ Repository: Check-out response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Repository: Error processing check-out:', error);
      throw error;
    }
  }
}