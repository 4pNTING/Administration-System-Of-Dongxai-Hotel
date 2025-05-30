// src/core/services/booking.service.ts
import { Booking } from "@core/domain/models/booking/list.model";
import { BookingRepositoryPort } from "@core/interface/repositoriesport/booking.port";
import { BookingUseCase } from "@core/use-cases/booking.use-case";
import { BookingInput } from "@core/domain/models/booking/form.model";
import { BookingRepository } from "@core/infrastructure/api/repository/booking.repository";

export class BookingService {
  private useCase: BookingUseCase;

  constructor(repositoryPort: BookingRepositoryPort) {
    this.useCase = new BookingUseCase(repositoryPort);
  }

  async getMany(): Promise<Booking[]> {
    return this.useCase.executeQuery();
  }

  async getOne(id: number): Promise<Booking> {
    return this.useCase.executeGetOne(id);
  }

  async create(data: BookingInput): Promise<Booking> {
    return this.useCase.executeCreate(data);
  }

  async update(id: number, data: Partial<BookingInput>): Promise<Booking> {
    return this.useCase.executeUpdate(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.useCase.executeDelete(id);
  }

  // เพิ่ม method ใหม่สำหรับ checkin
  async checkin(id: number): Promise<Booking> {
    return this.useCase.executeCheckin(id);
  }

  // เพิ่ม method ใหม่สำหรับ confirm
  async confirm(id: number): Promise<Booking> {
    return this.useCase.executeConfirm(id);
  }

  // เพิ่ม method ใหม่สำหรับ checkout
  async checkout(id: number): Promise<Booking> {
    return this.useCase.executeCheckout(id);
  }
}

const repository = new BookingRepository();
export const bookingService = new BookingService(repository);