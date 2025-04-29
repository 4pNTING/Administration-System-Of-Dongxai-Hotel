// src/views/apps/staff/components/StaffFilter.tsx
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

interface StaffFilterProps {
  value: string;
  genderFilter: string;
  onFilterChange: (value: string) => void;
  onGenderFilterChange: (value: string) => void;
}

export const StaffFilter = ({ value, genderFilter, onFilterChange, onGenderFilterChange }: StaffFilterProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        size="small"
        value={value}
        onChange={e => onFilterChange(e.target.value)}
        placeholder="ຄົ້ນຫາ..."
        sx={{ width: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
      />
      
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="gender-filter-label">ເພດ</InputLabel>
        <Select
          labelId="gender-filter-label"
          value={genderFilter}
          label="ເພດ"
          onChange={e => onGenderFilterChange(e.target.value)}
        >
          <MenuItem value="">ທັງໝົດ</MenuItem>
          <MenuItem value="ຊາຍ">ຊາຍ</MenuItem>
          <MenuItem value="ຍິງ">ຍິງ</MenuItem>
          <MenuItem value="ອື່ນໆ">ອື່ນໆ</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};