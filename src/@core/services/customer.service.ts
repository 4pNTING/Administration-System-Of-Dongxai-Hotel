import { Customer } from "@core/domain/models/customer/list.model";
import { CustomerRepositoryPort } from "@/@core/interface/reposport/customer.port";
import { CustomerUseCase } from "@core/use-cases/customer.use-case";
import { CustomerFormData } from "@core/domain/models/customer/form.model";
import { CustomerRepository } from "@core/infrastructure/api/repository/customer.repository";

export class CustomerService {
    private useCase: CustomerUseCase;

    constructor(repositoryPort: CustomerRepositoryPort) {
        this.useCase = new CustomerUseCase(repositoryPort);
    }

    async getMany(): Promise<Customer[]> {
        return this.useCase.executeQuery();
    }

    async getOne(id: number): Promise<Customer> {
        return this.useCase.executeGetOne(id);
    }

    async create(data: CustomerFormData): Promise<Customer> {
        return this.useCase.executeCreate(data);
    }

    async update(id: number, data: Partial<CustomerFormData>): Promise<Customer> {
        return this.useCase.executeUpdate(id, data);
    }

    async delete(id: number): Promise<void> {
        return this.useCase.executeDelete(id);
    }
}

const repository = new CustomerRepository();
export const customerService = new CustomerService(repository);