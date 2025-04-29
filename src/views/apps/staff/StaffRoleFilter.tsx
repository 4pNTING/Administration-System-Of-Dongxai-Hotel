// src/views/apps/staff/components/StaffRoleFilter.tsx
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface StaffRoleFilterProps {
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

export const StaffRoleFilter = ({ roleFilter, onRoleFilterChange }: StaffRoleFilterProps) => {
  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel id="role-filter-label">ສິດການໃຊ້ງານ</InputLabel>
      <Select
        labelId="role-filter-label"
        value={roleFilter}
        label="ສິດການໃຊ້ງານ"
        onChange={e => onRoleFilterChange(e.target.value)}
      >
        <MenuItem value="">ທັງໝົດ</MenuItem>
        <MenuItem value="ຜູ້ດູແລລະບົບ">ຜູ້ດູແລລະບົບ</MenuItem>
        <MenuItem value="ພະນັກງານຕ້ອນຮັບ">ພະນັກງານຕ້ອນຮັບ</MenuItem>
        <MenuItem value="ພະນັກງານທົ່ວໄປ">ພະນັກງານທົ່ວໄປ</MenuItem>
      </Select>
    </FormControl>
  );
};