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
import { RoomTypeFilter } from "@views/apps/roomstatus/components/RoomTypeFilter";
import { RoomDataTable } from "@views/apps/roomstatus/components/RoomDataTable";
import RoomFormInput from "@views/apps/roomstatus/components/RoomFormInput";

// Store Imports
import { useRoomStore } from "@core/domain/store/rooms/room.store";

export default function RoomPage() {
  const { items, fetchItems, isLoading } = useRoomStore();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filtered Items Logic
  const filteredItems = items ? items.filter(room => {
    const matchesSearch = !searchValue ||
      String(room.RoomId).includes(searchValue) ||
      (room.roomType?.TypeName || '').toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = !statusFilter ||
      (room.roomStatus?.StatusName || '') === statusFilter;

    const matchesType = !typeFilter ||
      (room.roomType?.TypeName || '') === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  }) : [];

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Filter Handlers
  const handleFilterChange = (value: string) => setSearchValue(value);
  const handleStatusFilterChange = (value: string) => setStatusFilter(value);
  const handleTypeFilterChange = (value: string) => setTypeFilter(value);

  // Form Handlers
  const handleCreate = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setSelectedItem(null);
    setFormOpen(false);
    
  };

  return (
    <Grid  spacing={4} justifyContent="center">
      <Grid item xs={12} md={10} lg={9}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={600}>
            ຈັດການຫ້ອງພັກ
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexGrow: 1 }}>
            <RoomFilter
              value={searchValue}
              statusFilter={statusFilter}
              onFilterChange={handleFilterChange}
              onStatusFilterChange={handleStatusFilterChange}
            />
            <RoomTypeFilter
              typeFilter={typeFilter}
              onTypeFilterChange={handleTypeFilterChange}
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{
              height: 'fit-content',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ເພິ່ມລາຍການ
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
