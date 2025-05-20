// src/core/use-cases/booking.use-case.ts
import { Booking } from "@core/domain/models/booking/list.model";
import { BookingRepositoryPort } from "@core/interface/repositoriesport/booking.port";
import { BookingInput } from "@core/domain/models/booking/form.model";

export class BookingUseCase {
  constructor(private readonly repository: BookingRepositoryPort) {}

  async executeQuery(): Promise<Booking[]> {
    try {
      return await this.repository.getMany();
    } catch (error) {
      throw error;
    }
  }

  async executeGetOne(id: number): Promise<Booking> {
    try {
      return await this.repository.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  async executeCreate(data: BookingInput): Promise<Booking> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async executeUpdate(id: number, data: Partial<BookingInput>): Promise<Booking> {
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