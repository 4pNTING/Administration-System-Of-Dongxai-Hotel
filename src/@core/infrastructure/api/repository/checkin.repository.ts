// src/core/infrastructure/api/repository/checkin.repository.ts
import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { CheckInInput } from "@core/domain/models/checkin/form.model";
import { CheckIn } from "@core/domain/models/checkin/list.model";
import { CheckInRepositoryPort } from "@/@core/interface/reposport/checkin.port";
import { CHECKIN_ENDPOINTS } from "../config/endpoints.config";
import { CHECKIN_QUERY } from "@core/infrastructure/queries/checkin.query";

export class CheckInRepository implements CheckInRepositoryPort {
  private readonly URL = CHECKIN_ENDPOINTS;

  async getMany(): Promise<CheckIn[]> {
    try {
      const query = CHECKIN_QUERY.LIST.createQuery();
      const response = await api.post<ApiResponse<CheckIn[]>>(this.URL.GET, query);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number): Promise<CheckIn> {
    try {
      const response = await api.get<ApiResponse<CheckIn>>(this.URL.DETAIL(id));
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async create(data: CheckInInput): Promise<CheckIn> {
    try {
      const response = await api.post<ApiResponse<CheckIn>>(this.URL.CREATE, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: Partial<CheckInInput>): Promise<CheckIn> {
    try {
      const response = await api.patch<ApiResponse<CheckIn>>(this.URL.UPDATE(id), data);
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

  async checkout(id: number): Promise<CheckIn> {
    try {
      const response = await api.patch<ApiResponse<CheckIn>>(this.URL.CHECKOUT(id), {});
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async findByCustomerId(customerId: number): Promise<CheckIn[]> {
    try {
      const response = await api.post<ApiResponse<CheckIn[]>>(this.URL.BY_CUSTOMER(customerId), {});
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async findByBookingId(bookingId: number): Promise<CheckIn | null> {
    try {
      const response = await api.post<ApiResponse<CheckIn>>(this.URL.BY_BOOKING(bookingId), {});
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async testEndpoints(): Promise<void> {}
}