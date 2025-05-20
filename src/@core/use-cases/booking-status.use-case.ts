// src/core/use-cases/booking-status.use-case.ts
import { BookingStatus } from "@core/domain/models/booking/booking-status/list.model";
import { BookingStatusRepositoryPort } from "@core/interface/repositoriesport/booking-status.port";

export class BookingStatusUseCase {
  constructor(private readonly repository: BookingStatusRepositoryPort) {}

  async executeQuery(): Promise<BookingStatus[]> {
    try {
      return await this.repository.getMany();
    } catch (error) {
      throw error;
    }
  }

  async executeGetOne(id: number): Promise<BookingStatus> {
    try {
      return await this.repository.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  async executeCreate(data: Partial<BookingStatus>): Promise<BookingStatus> {
    try {
      if (!data.StatusName) {
        throw new Error("StatusName is required");
      }
      return await this.repository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async executeUpdate(id: number, data: Partial<BookingStatus>): Promise<BookingStatus> {
    try {
      await this.repository.getOne(id);
      return await this.repository.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  async executeDelete(id: number): Promise<void> {
    try {
      await this.repository.getOne(id);
      await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}