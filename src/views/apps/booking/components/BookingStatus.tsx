// src/views/apps/booking/components/BookingStatus.tsx
import React from 'react';
import Chip from '@mui/material/Chip';

interface BookingStatusChipProps {
  status: any; // status object from the booking
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
  if (statusName.includes('ຢືນຢັນ') || statusName.includes('confirmed')) {
    chipColor = 'success';
  } else if (statusName.includes('ລໍຖ້າ') || statusName.includes('pending')) {
    chipColor = 'warning';
  } else if (statusName.includes('ຍົກເລີກ') || statusName.includes('cancel')) {
    chipColor = 'error';
  } else if (statusName.includes('ກຳລັງພັກ') || statusName.includes('staying')) {
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