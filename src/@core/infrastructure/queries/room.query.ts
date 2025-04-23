
import { QueryOptions } from "@core/domain/models/common/api.model";

export const ROOM_QUERY = {
  LIST: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "RoomId",
        "TypeId",
        "StatusId",
        "RoomPrice",
        "createdAt",
        "updatedAt"
      ],
      relations: ["roomType", "roomStatus"],
      filter: filter,
      getType: "many"
    })
  },

  DETAIL: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "RoomId",
        "TypeId",
        "StatusId",
        "RoomPrice",
        "createdAt",
        "updatedAt"
      ],
      relations: ["roomType", "roomStatus"],
      filter: filter,
      getType: "one"
    })
  },

  AVAILABLE: {
    createQuery: (checkInDate: string, checkOutDate: string): QueryOptions => ({
      select: [
        "RoomId",
        "TypeId",
        "StatusId",
        "RoomPrice"
      ],
      relations: ["roomType", "roomStatus"],
      filter: {
        available: true,
        checkInDate,
        checkOutDate
      },
      getType: "many"
    })
  }
} as const;