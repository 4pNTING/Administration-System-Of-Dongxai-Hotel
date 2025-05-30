// src/views/apps/roomstatus/components/DateRangePicker.tsx
'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import { format } from 'date-fns'
import { useRoomStore } from '@/@core/infrastructure/store/rooms/room.store'

interface DateRangePickerProps {
  onSearchCallback?: (rooms: any[]) => void
}

const DateRangePicker = ({ onSearchCallback }: DateRangePickerProps) => {
  const [checkInDate, setCheckInDate] = useState<string>('')
  const [checkOutDate, setCheckOutDate] = useState<string>('')
  const { getAvailableRooms, isSearching } = useRoomStore()

  // Check if checkout date is valid
  const isCheckOutValid = (): boolean => {
    if (!checkInDate || !checkOutDate) return true
    return new Date(checkOutDate) > new Date(checkInDate)
  }

  const handleSearch = async () => {
    if (!checkInDate || !checkOutDate || !isCheckOutValid()) {
      return
    }

    try {
      const rooms = await getAvailableRooms(checkInDate, checkOutDate)
      if (onSearchCallback) {
        onSearchCallback(rooms)
      }
    } catch (error) {
      console.error('Failed to search for available rooms:', error)
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Check-in
        </Typography>
        <TextField
          type="date"
          size="small"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          inputProps={{
            min: format(new Date(), 'yyyy-MM-dd')
          }}
          disabled={isSearching}
        />
      </Box>
      
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Check-out
        </Typography>
        <TextField
          type="date"
          size="small"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          error={checkOutDate !== '' && !isCheckOutValid()}
          helperText={checkOutDate !== '' && !isCheckOutValid() ? 'Must be after check-in' : ''}
          inputProps={{
            min: checkInDate || format(new Date(), 'yyyy-MM-dd')
          }}
          disabled={isSearching}
        />
      </Box>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<SearchIcon />}
        onClick={handleSearch}
        disabled={isSearching || !checkInDate || !checkOutDate || !isCheckOutValid()}
        sx={{ mt: 3 }}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </Button>
    </Box>
  )
}

export default DateRangePicker