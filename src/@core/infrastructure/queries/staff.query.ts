// src/core/infrastructure/queries/staff.query.ts
import { QueryOptions } from "@core/domain/models/common/api.model";

export const STAFF_QUERY = {
  LIST: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "StaffId", 
        "StaffName", 
        "Gender", 
        "Tel", 
        "Address", 
        "userName", 
        "Position", 
        "Salary",
        "role.id",
        "role.name",
        "role.description",
        "createdAt",
        "updatedAt"
      ],
      relations: ["role"],
      filter: filter,
      getType: "many"
    })
  },

  DETAIL: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "StaffId", 
        "StaffName", 
        "Gender", 
        "Tel", 
        "Address", 
        "userName", 
        "Position", 
        "Salary",
        "role.id",
        "role.name",
        "role.description",
        "createdAt",
        "updatedAt"
      ],
      relations: ["role"],
      filter: filter,
      getType: "one"
    })
  },

  BY_ROLE: {
    createQuery: (roleId: number): QueryOptions => ({
      select: [
        "StaffId", 
        "StaffName", 
        "Position", 
        "Salary",
        "role.id",
        "role.name"
      ],
      relations: ["role"],
      filter: { roleId },
      getType: "many"
    })
  },

  ACTIVE_STAFF: {
    createQuery: (): QueryOptions => ({
      select: [
        "StaffId", 
        "StaffName", 
        "Position",
        "role.name"
      ],
      relations: ["role"],
      filter: { isActive: true },
      getType: "many"
    })
  },

  STAFF_WITH_BOOKINGS: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "StaffId", 
        "StaffName", 
        "Position",
        "role.name",
        "bookings.BookingId",
        "bookings.BookingDate"
      ],
      relations: ["role", "bookings"],
      filter: filter,
      getType: "many"
    })
  }
} as const;