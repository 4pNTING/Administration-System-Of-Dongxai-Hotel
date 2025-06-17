// src/core/interface/repositoriesport/booking-status.port.ts
import { BookingStatus } from "@core/domain/models/booking/booking-status/list.model";

export interface BookingStatusRepositoryPort {
  getMany(): Promise<BookingStatus[]>;
  getOne(id: number): Promise<BookingStatus>;
  create(data: Partial<BookingStatus>): Promise<BookingStatus>;
  update(id: number, data: Partial<BookingStatus>): Promise<BookingStatus>;
  delete(id: number): Promise<void>;
}