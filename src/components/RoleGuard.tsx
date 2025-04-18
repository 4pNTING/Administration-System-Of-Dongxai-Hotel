// src/components/RoleGuard.tsx
'use client'

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { ROLES } from '@/@core/constants/role.constant';

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
};

export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role || ROLES.USER;
  
  if (!session) {
    return fallback;
  }
  
  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  return fallback;
}

// ตัวอย่างการใช้งาน
/*
<RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
  <Button>Delete User</Button>
</RoleGuard>
*/