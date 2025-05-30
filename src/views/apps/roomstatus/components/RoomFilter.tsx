import React, { useEffect } from 'react';

// MUI Imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// Store Imports
import { useRoomStatusStore } from '@/@core/infrastructure/store/room-status.store';

export interface RoomFilterProps {
    value: string;
    statusFilter: string;
    onFilterChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
}

export const RoomFilter = ({ value, statusFilter, onFilterChange, onStatusFilterChange }: RoomFilterProps) => {
    // ใช้ store เพื่อดึงรายการสถานะห้องพัก
    const { roomStatuses, fetchRoomStatuses } = useRoomStatusStore();
    
    // โหลดข้อมูลสถานะเมื่อคอมโพเนนต์ถูกโหลด
    useEffect(() => {
        fetchRoomStatuses();
    }, [fetchRoomStatuses]);

    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
                value={value}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder="ຄົ້ນຫາ"
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <i className="tabler-search text-lg" />
                        </InputAdornment>
                    ),
                }}
                sx={{ minWidth: 200 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="status-filter-label">ສະຖານະຫ້ອງພັກ</InputLabel>
                <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="ສະຖານະຫ້ອງພັກ"
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                >
                    <MenuItem value="">ທັ້ງໝົດ</MenuItem>
                    {roomStatuses.map((status) => (
                        <MenuItem key={status.StatusId} value={status.StatusName}>
                            {status.StatusName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};