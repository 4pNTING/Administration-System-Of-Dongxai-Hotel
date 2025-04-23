// src/views/apps/roomstatus/components/RoomActions.tsx
'use client'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'

// Store imports
import { useRoomStore } from '@core/domain/store/rooms/room.store'
import { useLoadingStore } from '@core/domain/store/useLoading.store'
import { useErrorStore } from '@core/domain/store/useError.store'

interface RoomActionsProps {
  onRefresh?: () => Promise<void>
}

const RoomActions = ({ onRefresh }: RoomActionsProps) => {
  const { setFormVisible, fetchItems } = useRoomStore()
  const { setLoading } = useLoadingStore()
  const { setError } = useErrorStore()

  // ดูการเรียก API
  const handleRefresh = async () => {
    console.log('Refreshing room data via store.fetchItems()...')
    try {
      setLoading(true)
      
      if (onRefresh) {
        await onRefresh()
      } else {
        await fetchItems()
      }
      
      console.log('Room data refreshed successfully')
    } catch (error: any) {
      console.error('Failed to refresh room data:', error)
      setError(error.message || 'Failed to refresh room data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddRoom = () => {
    setFormVisible(true)
  }

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Tooltip title="Refresh">
        <IconButton color="primary" onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={handleAddRoom}
      >
        Add New Room
      </Button>
    </Box>
  )
}

export default RoomActions