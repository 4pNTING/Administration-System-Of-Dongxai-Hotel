import { CreateCustomerDTO, UpdateCustomerDTO, CustomerQueryParams } from '../../../domain/models/customer.model'
import { CustomerEntity } from '../../../domain/entities/customer.entity'
import { ICustomerRepository } from '../../../interface/repositories/customer.port'
import api from '../axios.config'
import { CUSTOMER_ENDPOINTS } from '../config/endpoints.config'
import { CustomerMapper } from '../../mappers/customer.mapper'
import { ApiResponse, QueryOptions } from '@/@core/domain/models/common/api.model'
import { CUSTOMER_QUERY } from '../../queries/customer.query'

export class CustomerRepository implements ICustomerRepository {
  private readonly URL = CUSTOMER_ENDPOINTS

  async findAll(params: CustomerQueryParams = {}): Promise<CustomerEntity[]> {
    return this.queryList(params)
  }

  async findById(id: number): Promise<CustomerEntity | null> {
    try {
      const query = CUSTOMER_QUERY.DETAIL.createQuery({ CustomerId: id })
      const response = await api.post<ApiResponse<CustomerEntity>>(this.URL.GET, query)
      return CustomerMapper.toEntity(response.data.data)
    } catch (error) {
      console.error(`Error fetching customer with id ${id}:`, error)
      return null
    }
  }

  async findOne(params: CustomerQueryParams): Promise<CustomerEntity | null> {
    return this.queryDetail(params)
  }

  async queryDetail(params: CustomerQueryParams): Promise<CustomerEntity | null> {
    try {
      const query = CUSTOMER_QUERY.DETAIL.createQuery({
        ...params,
        getType: 'one'
      })

      const response = await api.post<ApiResponse<CustomerEntity>>(this.URL.GET, query)
      return CustomerMapper.toEntity(response.data.data)
    } catch (error) {
      console.error('Error fetching customer detail:', error)
      return null
    }
  }

  // src/infrastructure/repository-impl/customer.repository.ts
  async queryList(params: CustomerQueryParams): Promise<any[]> {
    try {
      const query = CUSTOMER_QUERY.LIST.createQuery({
        ...params,
        getType: 'many'
      })
      const response = await api.post<ApiResponse<any[]>>(this.URL.GET, query)
      // ถ้า response.data.data มีข้อมูล ส่งข้อมูลดิบกลับไป
      if (response.data.data) {
        return response.data.data
      }

      // ถ้า response.data เป็น array ส่งกลับไปเลย
      if (Array.isArray(response.data)) {
        console.log('Raw data array from API:', response.data)
        return response.data
      }

      console.log('Could not find customer data in the response')
      return []
    } catch (error) {
      console.error('Error fetching customer list:', error)
      return []
    }
  }

  async create(data: CreateCustomerDTO): Promise<CustomerEntity> {
    try {
      const response = await api.post<ApiResponse<CustomerEntity>>(this.URL.CREATE, data)
      const entity = CustomerMapper.toEntity(response.data.data)

      if (!entity) {
        throw new Error('Failed to create customer: Received null entity from API')
      }

      return entity
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  }

  async update(id: number, data: UpdateCustomerDTO): Promise<boolean> {
    try {
      await api.put<ApiResponse<any>>(this.URL.UPDATE(id), data)
      return true
    } catch (error) {
      console.error(`Error updating customer with id ${id}:`, error)
      throw error
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await api.delete<ApiResponse<any>>(this.URL.DELETE(id))
      return true
    } catch (error) {
      console.error(`Error deleting customer with id ${id}:`, error)
      throw error
    }
  }
}
