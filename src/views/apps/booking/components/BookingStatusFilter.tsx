import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { BookingStatus } from '@core/domain/models/booking/booking-status/list.model';

interface BookingStatusFilterProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  bookingStatuses: BookingStatus[];
}

export const BookingStatusFilter: React.FC<BookingStatusFilterProps> = ({ 
  statusFilter, 
  onStatusFilterChange,
  bookingStatuses = []
}) => {
  // Log incoming props for debugging
  console.log('BookingStatusFilter props:', { statusFilter, bookingStatuses });

  const loading = bookingStatuses.length === 0;
  
  return (
    <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
      <FormControl size="small" sx={{ minWidth: '200px' }}>
        <InputLabel id="booking-status-filter-label">ສະຖານະການຈອງ</InputLabel>
        <Select
          labelId="booking-status-filter-label"
          id="booking-status-filter"
          value={statusFilter}
          label="ສະຖານະການຈອງ"
          onChange={e => onStatusFilterChange(e.target.value)}
          startAdornment={loading ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : null}
        >
          <MenuItem value="">ທັງໝົດ</MenuItem>
          {bookingStatuses.map(status => (
            <MenuItem key={status.StatusId} value={status.StatusName}>
              {status.StatusName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};