// src/views/apps/checkin/CheckinSearch.tsx
import React from 'react';
import { Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Vuexy Components
import CustomTextField from '@core/components/mui/TextField';

interface CheckinSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const CheckinSearch: React.FC<CheckinSearchProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <CustomTextField
        fullWidth
        placeholder="ຄົ້ນຫາດ້ວຍເລກທີ່ການຈອງ, ເລກຫ້ອງ, ຊື່ລູກຄ້າ..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
          }
        }}
      />
    </Box>
  );
};