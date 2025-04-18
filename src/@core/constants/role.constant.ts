// src/core/constants/role.constant.ts

export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    STAFF: 'staff',
    USER: 'user'
  } as const;
  
  export type RoleType = typeof ROLES[keyof typeof ROLES];
  
  export const ROLE_LABELS: Record<RoleType, string> = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.MANAGER]: 'Manager',
    [ROLES.STAFF]: 'Staff',
    [ROLES.USER]: 'User'
  };
  
  export const ROLE_COLORS: Record<RoleType, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    [ROLES.ADMIN]: 'error',    // สีแดง
    [ROLES.MANAGER]: 'warning', // สีส้ม
    [ROLES.STAFF]: 'info',     // สีฟ้า
    [ROLES.USER]: 'success'    // สีเขียว
  };