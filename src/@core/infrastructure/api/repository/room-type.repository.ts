// src/core/infrastructure/repositories/room-type.repository.ts
import { api } from "@core/infrastructure/api/axios.config";
import { ActionResponse, ApiResponse } from "@core/domain/models/common/api.model";
import { RoomTypeRepositoryPort } from "@/@core/interface/reposport/room-type.port";
import { ROOM_TYPE_QUERY } from "@core/infrastructure/queries/room-type.query";
import { ROOM_TYPE_ENDPOINTS } from "../config/endpoints.config";
import { RoomTypeModel } from "@core/domain/models/room-type/list.model";
import { RoomTypeFormData } from "@core/domain/models/room-type/form.model";

export class RoomTypeRepository implements RoomTypeRepositoryPort {
  private readonly URL = ROOM_TYPE_ENDPOINTS;

  async getMany(): Promise<RoomTypeModel[]> {
    try {
      const query = ROOM_TYPE_QUERY.LIST.createQuery();
      const response = await api.post<ApiResponse<RoomTypeModel[]>>(this.URL.GET, query);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number): Promise<RoomTypeModel> {
    try {
      const query = ROOM_TYPE_QUERY.DETAIL.createQuery({ TypeId: id });
      const response = await api.post<ApiResponse<RoomTypeModel>>(this.URL.GET, query);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async create(data: RoomTypeFormData): Promise<RoomTypeModel> {
    try {
      const response = await api.post<ApiResponse<RoomTypeModel>>(this.URL.CREATE, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: RoomTypeFormData): Promise<boolean> {
    try {
      const response = await api.put<ActionResponse>(this.URL.UPDATE(id), data);
      return response.data.success;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const response = await api.delete<ActionResponse>(this.URL.DELETE(id));
      return response.data.success;
    } catch (error) {
      throw error;
    }
  }
}