import { RoomStatusModel } from "@core/domain/models/room-status/list.model";
import { RoomStatusRepositoryPort } from "@core/interface/repositoriesport/room-status.port";
import { RoomStatusUseCase } from "@core/use-cases/room-status.use-case";
import { RoomStatusRepository } from "@core/infrastructure/api/repository/room-status.repository";

export class RoomStatusService {
    private useCase: RoomStatusUseCase;

    constructor(repositoryPort: RoomStatusRepositoryPort) {
        this.useCase = new RoomStatusUseCase(repositoryPort);
    }

    async getMany(): Promise<RoomStatusModel[]> {
        return this.useCase.executeQuery();
    }

    async getOne(id: number): Promise<RoomStatusModel> {
        return this.useCase.executeGetOne(id);
    }

    async create(data: { StatusName: string }): Promise<RoomStatusModel> {
        return this.useCase.executeCreate(data);
    }

    async update(id: number, data: { StatusName: string }): Promise<boolean> {
        return this.useCase.executeUpdate(id, data);
    }

    async delete(id: number): Promise<boolean> {
        return this.useCase.executeDelete(id);
    }
}

const repository = new RoomStatusRepository();
export const roomStatusService = new RoomStatusService(repository);