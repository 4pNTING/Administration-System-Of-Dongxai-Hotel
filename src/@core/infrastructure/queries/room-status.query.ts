// @core/infrastructure/queries/room-status.query.ts
import { QueryOptions } from "@core/domain/models/common/api.model";

export const ROOM_STATUS_QUERY = {
  LIST: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      filter: filter,
      getType: "many"
    })
  },

  DETAIL: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      filter: filter,
      getType: "one"
    })
  }
} as const;