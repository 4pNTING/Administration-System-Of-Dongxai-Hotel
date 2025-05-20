// src/core/infrastructure/api/repository/booking.repository.ts
import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { BookingInput } from "@core/domain/models/booking/form.model";
import { Booking } from "@core/domain/models/booking/list.model";
import { BookingRepositoryPort } from "@core/interface/repositoriesport/booking.port";
import { BOOKING_ENDPOINTS } from "../config/endpoints.config";
import { BOOKING_QUERY } from "@core/infrastructure/queries/booking.query";

export class BookingRepository implements BookingRepositoryPort {
  private readonly URL = BOOKING_ENDPOINTS;

  async getMany(): Promise<Booking[]> {
    try {
      const query = BOOKING_QUERY.LIST.createQuery();
      const response = await api.post<ApiResponse<Booking[]>>(this.URL.GET, query);
      console.log('Response from server:', response.data.data);
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
}