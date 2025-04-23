"use client";

import { useEffect, useState } from "react";

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

// Component Imports
import { RoomFilter } from "@views/apps/roomstatus/components/RoomFilter";
import { RoomDataTable } from "@views/apps/roomstatus/components/RoomDataTable";
import RoomFormInput from "@views/apps/roomstatus/components/RoomFormInput";

// Store Imports
import { useRoomStore } from "@core/domain/store/rooms/room.store";

export default function RoomPage() {
    const { items, fetchItems, isLoading } = useRoomStore();
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const filteredItems = items ? items.filter(room => {
      const matchesSearch = !searchValue || 
          String(room.RoomId).includes(searchValue) ||
          (room.roomType?.TypeName || '').toLowerCase().includes(searchValue.toLowerCase());
      
      const matchesStatus = !statusFilter || 
          (room.roomStatus?.StatusName || '') === statusFilter;
      
      return matchesSearch && matchesStatus;
  }) : [];

    useEffect(() => {
      console.log('📢 Component mounted, calling fetchItems()');
        fetchItems();
    }, [fetchItems]);

    const handleFilterChange = (value: string) => {
        setSearchValue(value);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
    };

    const handleCreate = () => {
        setSelectedItem(null);
        setFormOpen(true);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setFormOpen(true);
    };

    const handleFormClose = () => {
        setSelectedItem(null);
        setFormOpen(false);
    };

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h5">จัดการข้อมูลห้องพัก</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <RoomFilter 
                        value={searchValue} 
                        statusFilter={statusFilter}
                        onFilterChange={handleFilterChange}
                        onStatusFilterChange={handleStatusFilterChange}
                    />
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={handleCreate}
                    >
                        เพิ่มห้องพักใหม่
                    </Button>
                </Box>

                <RoomDataTable 
                    data={filteredItems} 
                    loading={isLoading} 
                    onEdit={handleEdit} 
                />
            </Grid>

            <RoomFormInput 
                open={formOpen} 
                onClose={handleFormClose} 
                selectedItem={selectedItem} 
            />
        </Grid>
    );
}