import React, { useEffect } from 'react';

// MUI Imports
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// Store Imports
import { useRoomTypeStore } from '@/@core/infrastructure/store/roomType.store';

export interface RoomTypeFilterProps {
    typeFilter: string;
    onTypeFilterChange: (value: string) => void;
}

export const RoomTypeFilter = ({ typeFilter, onTypeFilterChange }: RoomTypeFilterProps) => {
    // ใช้ store เพื่อดึงรายการประเภทห้องพัก
    const { roomTypes, fetchRoomTypes, loading } = useRoomTypeStore();
    
    // โหลดข้อมูลประเภทห้องเมื่อคอมโพเนนต์ถูกโหลด
    useEffect(() => {
        fetchRoomTypes();
    }, [fetchRoomTypes]);

    return (
        <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="type-filter-label">ປະເພດຫ້ອງພັກ</InputLabel>
            <Select
                labelId="type-filter-label"
                value={typeFilter}
                label="ປະເພດຫ້ອງພັກ"
                onChange={(e) => onTypeFilterChange(e.target.value)}
                disabled={loading}
            >
                <MenuItem value="">ທັ້ງໝົດ</MenuItem>
                {roomTypes.map((type) => (
                    <MenuItem key={type.TypeId} value={type.TypeName}>
                        {type.TypeName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};