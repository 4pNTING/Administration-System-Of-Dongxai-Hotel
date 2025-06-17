import { BookingInput } from "@core/domain/models/booking/form.model";
import { Booking } from "@core/domain/models/booking/list.model";


export interface BookingRepositoryPort {
  getMany(): Promise<Booking[]>;
  getOne(id: number): Promise<Booking>;
  create(data: BookingInput): Promise<Booking>;
  update(id: number, data: Partial<BookingInput>): Promise<Booking>;
  delete(id: number): Promise<void>;


  checkin(id: number): Promise<Booking>;
  confirm(id: number): Promise<Booking>;
  checkout(id: number): Promise<Booking>;
  cancel(id: number): Promise<Booking>; 
}