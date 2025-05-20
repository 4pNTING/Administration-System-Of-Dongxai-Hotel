// src/core/infrastructure/api/repository/booking-status.repository.ts
import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { BookingStatus } from "@core/domain/models/booking/booking-status/list.model";
import { BookingStatusRepositoryPort } from "@core/interface/repositoriesport/booking-status.port";
import { BOOKING_STATUS_ENDPOINTS } from "../config/endpoints.config";

export class BookingStatusRepository implements BookingStatusRepositoryPort {
  private readonly URL = BOOKING_STATUS_ENDPOINTS;

  async getMany(): Promise<BookingStatus[]> {
    try {
      const response = await api.get<ApiResponse<BookingStatus[]>>(this.URL.GET);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number): Promise<BookingStatus> {
    try {
      const response = await api.get<ApiResponse<BookingStatus>>(this.URL.DETAIL(id));
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async create(data: Partial<BookingStatus>): Promise<BookingStatus> {
    try {
      const response = await api.post<ApiResponse<BookingStatus>>(this.URL.CREATE, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: Partial<BookingStatus>): Promise<BookingStatus> {
    try {
      const response = await api.patch<ApiResponse<BookingStatus>>(this.URL.UPDATE(id), data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete<ApiResponse<void>>(this.URL.DELETE(id));
    } catch (error) {
      throw error;
    }
  }
}