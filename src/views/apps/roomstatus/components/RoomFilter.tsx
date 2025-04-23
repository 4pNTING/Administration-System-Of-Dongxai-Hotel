import React from 'react';

// MUI Imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// Icon Imports
import SearchIcon from '@mui/icons-material/Search';

export interface RoomFilterProps {
    value: string;
    statusFilter: string;
    onFilterChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
}

export const RoomFilter = ({ value, statusFilter, onFilterChange, onStatusFilterChange }: RoomFilterProps) => {
    const statuses = [
        { label: 'ทั้งหมด', value: '' },
        { label: 'ว่าง', value: 'Available' },
        { label: 'ไม่ว่าง', value: 'Occupied' },
        { label: 'ซ่อมบำรุง', value: 'Maintenance' },
    ];

    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
                value={value}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder="ค้นหา"
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
                sx={{ minWidth: 200 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="status-filter-label">สถานะห้องพัก</InputLabel>
                <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="สถานะห้องพัก"
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                >
                    {statuses.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                            {status.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};