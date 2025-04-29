// src/core/infrastructure/api/repository/staff.repository.ts
import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { StaffInput } from "@core/domain/models/staffs/form.model";
import { Staff } from "@core/domain/models/staffs/list.model";
import { StaffRepositoryPort } from "@core/interface/repositoriesport/staff.port";
import { STAFF_ENDPOINTS } from "../config/endpoints.config";
import { STAFF_QUERY } from "@core/infrastructure/queries/staff.query";

export class StaffRepository implements StaffRepositoryPort {
  private readonly URL = STAFF_ENDPOINTS;

  async getMany(): Promise<Staff[]> {
    try {
      const query = STAFF_QUERY.LIST.createQuery();
      const response = await api.post<ApiResponse<Staff[]>>(this.URL.GET, query);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching staffs:', error);
      throw error;
    }
  }

  async getOne(id: number): Promise<Staff> {
    try {
      const query = STAFF_QUERY.DETAIL.createQuery({ StaffId: id });
      const response = await api.post<ApiResponse<Staff>>(this.URL.GET, query);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching staff details:', error);
      throw error;
    }
  }

  async create(data: StaffInput): Promise<Staff> {
    try {
      const response = await api.post<ApiResponse<Staff>>(this.URL.CREATE, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<StaffInput>): Promise<Staff> {
    try {
      console.log('Updating staff:', id, 'with data:', data);
      
      // เปลี่ยนจาก PUT เป็น PATCH ตาม controller ในฝั่ง backend
      const response = await api.patch<ApiResponse<Staff>>(this.URL.UPDATE(id), data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete<ApiResponse<void>>(this.URL.DELETE(id));
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  }
}