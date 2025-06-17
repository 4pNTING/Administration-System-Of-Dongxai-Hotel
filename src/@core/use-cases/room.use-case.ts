// src/app/core/use-cases/room.use-case.ts
import { Room } from "@core/domain/models/rooms/list.model";
import { RoomRepositoryPort } from "@/@core/interface/reposport/room.port";
import { RoomFormData } from "@core/domain/models/rooms/form.model";

export class RoomUseCase {
  constructor(private readonly repository: RoomRepositoryPort) {}

  async executeQuery(): Promise<Room[]> {
    try {
      return await this.repository.getMany();
    } catch (error) {
      throw error;
    }
  }

  async executeGetOne(id: number): Promise<Room> {
    try {
      return await this.repository.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  async executeGetAvailable(checkInDate: string, checkOutDate: string): Promise<Room[]> {
    try {
      return await this.repository.getAvailable(checkInDate, checkOutDate);
    } catch (error) {
      throw error;
    }
  }

  async executeCreate(data: RoomFormData): Promise<Room> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async executeUpdate(id: number, data: Partial<RoomFormData>): Promise<Room> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  async executeDelete(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}