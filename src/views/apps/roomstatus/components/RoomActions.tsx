import React from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// Type Imports
import { Room } from '@core/domain/models/rooms/list.model'

interface RoomActionButtonsProps {
  room: Room
  onEdit: (room: Room) => void
  onDelete: (id: number) => Promise<void>
}

const RoomActionButtons = ({ room, onEdit, onDelete }: RoomActionButtonsProps) => {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Tooltip title='ແກ້ໄຂ'>
        <IconButton
          color='primary'
          onClick={() => onEdit(room)}
          size='small'
          // sx={{ 
          //   bgcolor: 'rgba(58, 53, 260, 0.1)', 
          //   '&:hover': { bgcolor: 'rgba(58, 53, 260, 0.2)' } 
          // }}
        >
          <i className='tabler-edit text-lg' />
        </IconButton>
      </Tooltip>
      <Tooltip title='ລົບ'>
        <IconButton
          // color='error'
          onClick={() => onDelete(room.RoomId)}
          size='small'
          // sx={{ 
          //   bgcolor: 'rgba(234, 84, 85, 0.1)', 
          //   '&:hover': { bgcolor: 'rgba(234, 84, 85, 0.2)' } 
          // }}
        >
          <i className='tabler-trash text-lg' />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default RoomActionButtons