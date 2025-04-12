import { CustomerEntity, CreateCustomerDTO, UpdateCustomerDTO, CustomerQueryParams } from '../domain/entities/customer.entity';
import { ICustomerRepository } from '../interface/repositories/customer.port';

import { CustomerUseCase } from '../use-cases/customer.use-case';
import { CustomerRepository } from '../infrastructure/api/repository/customer.repository';

export class CustomerService {
    private useCase: CustomerUseCase;

    constructor(repositoryPort: ICustomerRepository) {
        this.useCase = new CustomerUseCase(repositoryPort);
    }

    async getMany(params: CustomerQueryParams = {}): Promise<CustomerEntity[]> {
        return this.useCase.getAllCustomers(params);
    }

    async getById(id: number): Promise<CustomerEntity | null> {
        return this.useCase.getCustomerById(id);
    }

    async create(data: CreateCustomerDTO): Promise<CustomerEntity> {
        return this.useCase.createCustomer(data);
    }

    async update(id: number, data: UpdateCustomerDTO): Promise<boolean> {
        return this.useCase.updateCustomer(id, data);
    }

    async delete(id: number): Promise<boolean> {
        return this.useCase.deleteCustomer(id);
    }

    async searchByName(name: string): Promise<CustomerEntity[]> {
        const params: CustomerQueryParams = {
            filter: {
                name: { $like: `%${name}%` }
            }
        };
        
        return this.useCase.getAllCustomers(params);
    }

    async getTopCustomers(limit: number = 10): Promise<CustomerEntity[]> {
        const params: CustomerQueryParams = {
            sort: { bookingCount: 'DESC' },
            limit
        };
        
        return this.useCase.getAllCustomers(params);
    }
}

// สร้าง instance เดียวเพื่อใช้งานทั่วทั้งแอปพลิเคชัน
const repository = new CustomerRepository();
export const customerService = new CustomerService(repository);