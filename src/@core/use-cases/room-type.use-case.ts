// @core/use-cases/room-type.use-case.ts
import { RoomTypeModel } from "@core/domain/models/room-type/list.model";
import { RoomTypeFormData } from "@core/domain/models/room-type/form.model";
import { RoomTypeRepositoryPort } from "@core/interface/repositoriesport/room-type.port";

export class RoomTypeUseCase {
  constructor(private repository: RoomTypeRepositoryPort) {}

  async executeQuery(): Promise<RoomTypeModel[]> {
    return this.repository.getMany();
  }

  async executeGetOne(id: number): Promise<RoomTypeModel> {
    return this.repository.getOne(id);
  }

  async executeCreate(data: RoomTypeFormData): Promise<RoomTypeModel> {
    return this.repository.create(data);
  }

  async executeUpdate(id: number, data: RoomTypeFormData): Promise<boolean> {
    return this.repository.update(id, data);
  }

  async executeDelete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}