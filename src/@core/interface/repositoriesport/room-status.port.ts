// @core/interface/repositoriesport/room-status.port.ts
import { RoomStatusModel } from "@core/domain/models/room-status/list.model";

export interface RoomStatusRepositoryPort {
  getMany(): Promise<RoomStatusModel[]>;
  getOne(id: number): Promise<RoomStatusModel>;
  create(data: { StatusName: string }): Promise<RoomStatusModel>;
  update(id: number, data: { StatusName: string }): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}