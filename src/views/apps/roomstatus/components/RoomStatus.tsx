import React from 'react'

// MUI Imports
import Chip from '@mui/material/Chip'

type RoomStatusType = {
  [key: string]: {
    color: 'success' | 'warning' | 'error' | 'default' | 'primary' | 'secondary' | 'info'
  }
}

// Status configuration based on StatusName values
const roomStatusObj: RoomStatusType = {
  'ວ່າງ': { color: 'success' },
  'ຈອງ': { color: 'warning' },
  'ບໍ່ວ່າງ': { color: 'error' },
  'ຫ້ອງຫວ່າງ': { color: 'info' },
  'ສະອາດ': { color: 'success' },
  'ເຄິ່ງນອນ': { color: 'primary' },
  'ບໍາລຸງຮັກສາ': { color: 'secondary' }
}

interface RoomStatusChipProps {
  status: string | number | { StatusId?: number, StatusName?: string } | null | undefined
}

const RoomStatusChip = ({ status }: RoomStatusChipProps) => {
  // Extract status name from different possible input types
  let statusName = '';
  
  if (typeof status === 'string') {
    statusName = status;
  } else if (typeof status === 'object' && status !== null) {
    if ('StatusName' in status && status.StatusName) {
      statusName = status.StatusName;
    } else if ('StatusId' in status && status.StatusId) {
      // Fallback to old ID-based mapping if needed
      const idToName: Record<number, string> = {
        1: 'ວ່າງ',
        2: 'ຈອງ',
        3: 'ບໍ່ວ່າງ',
        4: 'ຫ້ອງຫວ່າງ',
        5: 'ສະອາດ',
        6: 'ເຄິ່ງນອນ',
        7: 'ບໍາລຸງຮັກສາ',
      };
      statusName = idToName[status.StatusId] || '';
    }
  }

  // Find color based on status name, default to 'default' if not found
  const color = statusName && roomStatusObj[statusName] 
    ? roomStatusObj[statusName].color 
    : 'default';

  return (
    <div className='flex justify-center'>
      <Chip
        label={statusName || 'ບໍ່ຮູ້ສະຖານະ'}
        variant='tonal'
        color={color}
        size='small'
      />
    </div>
  )
}

export default RoomStatusChip