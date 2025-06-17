// src/core/use-cases/booking.use-case.ts
import { Booking } from "@core/domain/models/booking/list.model";
import { BookingRepositoryPort } from "@/@core/interface/reposport/booking.port";
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

  async executeCancel(id: number): Promise<Booking> {
    try {
      return await this.repository.cancel(id);
    } catch (error) {
      throw error;
    }
  }

  async executeCheckin(id: number): Promise<Booking> {
    try {
      return await this.repository.checkin(id);
    } catch (error) {
      throw error;
    }
  }

  async executeConfirm(id: number): Promise<Booking> {
    try {
      return await this.repository.confirm(id);
    } catch (error) {
      throw error;
    }
  }

  async executeCheckout(id: number): Promise<Booking> {
    try {
      return await this.repository.checkout(id);
    } catch (error) {
      console.error('❌ UseCase: Error executing check-out:', error);
      throw error;
    }
  }
}