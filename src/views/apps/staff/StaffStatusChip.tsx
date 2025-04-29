// src/views/apps/staff/components/StaffStatusChip.tsx
import React from 'react'
import Chip from '@mui/material/Chip'

interface StaffStatusChipProps {
  gender: string
}

const StaffStatusChip = ({ gender }: StaffStatusChipProps) => {
  // กำหนดสี chip ตามเพศ
  const getChipProps = () => {
    switch (gender) {
      case 'MALE':
        return {
          label: 'ຊາຍ',
          color: 'primary' as const,
          variant: 'outlined' as const
        }
      case 'FEMALE':
        return {
          label: 'ຍິງ',
          color: 'secondary' as const,
          variant: 'outlined' as const
        }
      default:
        return {
          label: 'ອື່ນໆ',
          color: 'default' as const,
          variant: 'outlined' as const
        }
    }
  }

  const chipProps = getChipProps()

  return (
    <div className='flex justify-center'>
      <Chip
        {...chipProps}
        size='small'
        sx={{ minWidth: '80px' }}
      />
    </div>
  )
}

export default StaffStatusChip