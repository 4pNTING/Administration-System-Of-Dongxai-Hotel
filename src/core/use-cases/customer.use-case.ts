// ไฟล์: src/core/use-cases/customer.use-case.ts
import { CustomerEntity, CreateCustomerDTO, UpdateCustomerDTO, CustomerQueryParams } from '../domain/entities/customer.entity';
import { ICustomerRepository } from '../interface/repositories/customer.port';
import { CustomerService, customerService } from '../services/customer.service';

export class CustomerUseCase {
  private customerService: CustomerService;
  
  constructor(customerRepository: ICustomerRepository) {
    this.customerService = new CustomerService(customerRepository);
  }

  async getAllCustomers(params: CustomerQueryParams = {}): Promise<CustomerEntity[]> {
    return this.customerService.getMany(params);
  }

  async getCustomerById(id: number): Promise<CustomerEntity | null> {
    return this.customerService.getById(id);
  }

  async createCustomer(data: CreateCustomerDTO): Promise<CustomerEntity> {
    return this.customerService.create(data);
  }

  async updateCustomer(id: number, data: UpdateCustomerDTO): Promise<boolean> {
    return this.customerService.update(id, data);
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customerService.delete(id);
  }

  async searchCustomers(name: string): Promise<CustomerEntity[]> {
    return this.customerService.searchByName(name);
  }

  async getTopCustomers(limit: number = 10): Promise<CustomerEntity[]> {
    return this.customerService.getTopCustomers(limit);
  }
}