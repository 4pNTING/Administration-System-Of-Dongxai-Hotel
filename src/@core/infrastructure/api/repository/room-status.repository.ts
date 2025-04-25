import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { RoomStatusRepositoryPort } from "@core/interface/repositoriesport/room-status.port";
import { ROOM_STATUS_QUERY } from "@core/infrastructure/queries/room-status.query";
import { ROOM_STATUS_ENDPOINTS } from "@core/infrastructure/api/config/endpoints.config";
import { RoomStatusModel } from "@core/domain/models/room-status/list.model";

export class RoomStatusRepository implements RoomStatusRepositoryPort {
    private readonly URL = ROOM_STATUS_ENDPOINTS;

    async getMany(): Promise<RoomStatusModel[]> {
        try {
            const query = ROOM_STATUS_QUERY.LIST.createQuery();
            const response = await api.post<ApiResponse<RoomStatusModel[]>>(this.URL.GET, query);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async getOne(id: number): Promise<RoomStatusModel> {
        try {
            const query = ROOM_STATUS_QUERY.DETAIL.createQuery({ StatusId: id });
            const response = await api.post<ApiResponse<RoomStatusModel>>(this.URL.GET, query);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async create(data: { StatusName: string }): Promise<RoomStatusModel> {
        try {
            const response = await api.post<ApiResponse<RoomStatusModel>>(this.URL.CREATE, data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: { StatusName: string }): Promise<boolean> {
        try {
            const response = await api.put<ApiResponse<boolean>>(this.URL.UPDATE(id), data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const response = await api.delete<ApiResponse<boolean>>(this.URL.DELETE(id));
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
}