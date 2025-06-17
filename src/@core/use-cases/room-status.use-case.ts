// @core/use-cases/room-status.use-case.ts
import { RoomStatusModel } from "@core/domain/models/room-status/list.model";
import { RoomStatusRepositoryPort } from "@/@core/interface/reposport/room-status.port";

export class RoomStatusUseCase {
  constructor(private repository: RoomStatusRepositoryPort) {}

  async executeQuery(): Promise<RoomStatusModel[]> {
    return this.repository.getMany();
  }

  async executeGetOne(id: number): Promise<RoomStatusModel> {
    return this.repository.getOne(id);
  }

  async executeCreate(data: { StatusName: string }): Promise<RoomStatusModel> {
    return this.repository.create(data);
  }

  async executeUpdate(id: number, data: { StatusName: string }): Promise<boolean> {
    return this.repository.update(id, data);
  }

  async executeDelete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}