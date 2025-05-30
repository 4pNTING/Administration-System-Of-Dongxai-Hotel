// src/views/apps/checkin/components/CheckinSearch.tsx
import React from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface CheckinSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const CheckinSearch: React.FC<CheckinSearchProps> = ({
  value,
  onChange
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        size="medium"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ຄົ້ນຫາດ້ວຍລະຫັດການຈອງ, ຫ້ອງພັກ ຫຼື ຊື່ລູກຄ້າ"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        sx={{ maxWidth: 600 }}
      />
    </Box>
  );
};