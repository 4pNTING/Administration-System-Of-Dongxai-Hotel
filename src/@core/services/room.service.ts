// src/app/core/services/room.service.ts
import { Room } from "@core/domain/models/rooms/list.model";
import { RoomRepositoryPort } from "@core/interface/repositoriesport/room.port";
import { RoomUseCase } from "@core/use-cases/room.use-case";
import { RoomFormData } from "@core/domain/models/rooms/form.model";
import { RoomRepository } from "@core/infrastructure/api/repository/room.repository";

export class RoomService {
  private useCase: RoomUseCase;

  constructor(repositoryPort: RoomRepositoryPort) {
    this.useCase = new RoomUseCase(repositoryPort);
  }

  async getMany(): Promise<Room[]> {
    return this.useCase.executeQuery();
  }

  async getOne(id: number): Promise<Room> {
    return this.useCase.executeGetOne(id);
  }

  async getAvailable(checkInDate: string, checkOutDate: string): Promise<Room[]> {
    return this.useCase.executeGetAvailable(checkInDate, checkOutDate);
  }

  async create(data: RoomFormData): Promise<Room> {
    return this.useCase.executeCreate(data);
  }

  async update(id: number, data: Partial<RoomFormData>): Promise<Room> {
    return this.useCase.executeUpdate(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.useCase.executeDelete(id);
  }
}

const repository = new RoomRepository();
export const roomService = new RoomService(repository);