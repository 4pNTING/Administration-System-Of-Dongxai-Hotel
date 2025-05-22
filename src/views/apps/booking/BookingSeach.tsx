// src/views/apps/booking/BookingFilter.tsx
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';

interface BookingSeachrProps {
  value: string;
  onFilterChange: (value: string) => void;
}

export const BookingSeach = ({ value, onFilterChange }: BookingSeachrProps) => {
  return (
    <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
      <TextField
        size="small"
        value={value}
        onChange={e => onFilterChange(e.target.value)}
        placeholder="ຄົ້ນຫາດ້ວຍລະຫັດການຈອງ, ຫ້ອງພັກ ຫຼື ລູກຄ້າ"
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