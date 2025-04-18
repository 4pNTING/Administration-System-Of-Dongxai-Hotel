// ไฟล์: src/core/interfaces/repositories/customer.repository.interface.ts
import { CreateCustomerDTO, CustomerQueryParams, UpdateCustomerDTO } from '@/@core/domain/models/customer.model';
import { CustomerEntity } from '../../domain/entities/customer.entity';

export interface ICustomerRepository {
  findAll(params: CustomerQueryParams): Promise<CustomerEntity[]>;
  findOne(params: CustomerQueryParams): Promise<CustomerEntity | null>;
  queryDetail(params: CustomerQueryParams): Promise<CustomerEntity | null>;
  queryList(params: CustomerQueryParams): Promise<CustomerEntity[]>;
  create(data: CreateCustomerDTO): Promise<CustomerEntity>;
  update(id: number, data: UpdateCustomerDTO): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<CustomerEntity | null>;
}