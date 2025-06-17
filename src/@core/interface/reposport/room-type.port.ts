// @core/interface/repositoriesport/room-type.port.ts
import { RoomTypeModel } from "@core/domain/models/room-type/list.model";
import { RoomTypeFormData } from "@core/domain/models/room-type/form.model";

export interface RoomTypeRepositoryPort {
  getMany(): Promise<RoomTypeModel[]>;
  getOne(id: number): Promise<RoomTypeModel>;
  create(data: RoomTypeFormData): Promise<RoomTypeModel>;
  update(id: number, data: RoomTypeFormData): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}