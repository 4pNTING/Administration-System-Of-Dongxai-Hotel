// @core/services/room-type.service.ts
import { RoomTypeModel } from "@core/domain/models/room-type/list.model";
import { RoomTypeRepositoryPort } from "@core/interface/repositoriesport/room-type.port";
import { RoomTypeUseCase } from "@core/use-cases/room-type.use-case";
import { RoomTypeRepository } from "@core/infrastructure/api/repository/room-type.repository";
import { RoomTypeFormData } from "@core/domain/models/room-type/form.model";

export class RoomTypeService {
    private useCase: RoomTypeUseCase;

    constructor(repositoryPort: RoomTypeRepositoryPort) {
        this.useCase = new RoomTypeUseCase(repositoryPort);
    }

    async getMany(): Promise<RoomTypeModel[]> {
        return this.useCase.executeQuery();
    }

    async getOne(id: number): Promise<RoomTypeModel> {
        return this.useCase.executeGetOne(id);
    }

    async create(data: RoomTypeFormData): Promise<RoomTypeModel> {
        return this.useCase.executeCreate(data);
    }

    async update(id: number, data: RoomTypeFormData): Promise<boolean> {
        return this.useCase.executeUpdate(id, data);
    }

    async delete(id: number): Promise<boolean> {
        return this.useCase.executeDelete(id);
    }
}

const repository = new RoomTypeRepository();
export const roomTypeService = new RoomTypeService(repository);