// src/views/apps/checkin/CheckinSearch.tsx
import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';

interface CheckInSearchProps {
  value: string;
  onFilterChange: (value: string) => void;
}

export const CheckInSearch: React.FC<CheckInSearchProps> = ({ value, onFilterChange }) => {
  return (
    <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
      <TextField
        size="small"
        value={value}
        onChange={e => onFilterChange(e.target.value)}
        placeholder="ຄົ້ນຫາດ້ວຍລະຫັດເຊັກອິນ, ຫ້ອງພັກ ຫຼື ລູກຄ້າ"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
        sx={{ minWidth: '250px' }}
      />
    </Box>
  );
};