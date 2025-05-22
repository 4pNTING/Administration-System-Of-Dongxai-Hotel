// src/views/apps/booking/components/BookingStatus.tsx
import React from 'react';
import Chip from '@mui/material/Chip';

interface BookingStatusChipProps {
  status: {
    StatusId: number;
    StatusName?: string;
  };
}

const BookingStatusChip: React.FC<BookingStatusChipProps> = ({ status }) => {
  if (!status) {
    return <Chip label="ບໍ່ມີຂໍ້ມູນ" color="default" size="small" />;
  }

  // ตรวจสอบว่ามี StatusName หรือไม่
  const statusName = status.StatusName || 'Unknown';

  // กำหนดสีของ Chip ตามสถานะ
  let chipColor: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
  
  // ตรวจสอบสถานะและกำหนดสี
  if (status.StatusId === 3 || statusName.includes('ຊຳລະແລ້ວ') || statusName.includes('confirmed')) {
    chipColor = 'success';
  } else if (status.StatusId === 1 || statusName.includes('ຮອດຳເນີນການ') || statusName.includes('pending')) {
    chipColor = 'warning';
  } else if (status.StatusId === 4 || statusName.includes('ຍົກເລີກ') || statusName.includes('cancel')) {
    chipColor = 'error';
  } else if (status.StatusId === 2 || statusName.includes('ກຳລັງພັກ') || statusName.includes('staying')) {
    chipColor = 'info';
  }

  return (
    <Chip 
      label={statusName} 
      color={chipColor} 
      size="small"
      sx={{ 
        fontWeight: 500,
        fontSize: '0.75rem',
        height: 24
      }} 
    />
  );
};

export default BookingStatusChip;