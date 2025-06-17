// src/views/apps/checkin/components/CheckInStatusChip.tsx
import React from 'react';
import Chip from '@mui/material/Chip';

interface CheckInStatusChipProps {
  hasCheckOut: boolean;
  status?: {
    StatusId?: number;
    StatusName?: string;
  };
}

const CheckInStatusChip: React.FC<CheckInStatusChipProps> = ({ hasCheckOut, status }) => {
  // กำหนดสีของ Chip ตามสถานะ
  let chipColor: 'success' | 'warning' | 'error' | 'info' | 'default' = hasCheckOut ? 'default' : 'success';
  let statusText = hasCheckOut ? 'ເຊັກເອົາແລ້ວ' : 'ກຳລັງພັກ';

  // ถ้ามี status object ให้ใช้ข้อมูลจากนั้น
  if (status) {
    statusText = status.StatusName || statusText;
    
    if (status.StatusId === 1 || status.StatusName?.includes('ກຳລັງພັກ')) {
      chipColor = 'success';
    } else if (status.StatusId === 2 || status.StatusName?.includes('ເຊັກເອົາ')) {
      chipColor = 'default';
    }
  }

  return (
    <Chip 
      label={statusText} 
      color={chipColor} 
      size="small"
      sx={{ 
        fontWeight: 500,
        fontSize: '0.75rem',
        height: 24,
        minWidth: 80,
        borderRadius: 1
      }} 
    />
  );
};

export default CheckInStatusChip;