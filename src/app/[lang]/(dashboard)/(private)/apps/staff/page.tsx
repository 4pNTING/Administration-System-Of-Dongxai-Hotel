"use client";

import { useEffect, useState } from "react";

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

// Component Imports
import { StaffFilter } from "@views/apps/staff/StaffFilter";
import { StaffRoleFilter } from "@views/apps/staff/StaffRoleFilter";
import StaffDataTable from "@views/apps/staff/StaffTable";
import StaffFormInput from "@views/apps/staff/StaffFormInput";
import StaffDataTableTest from "@views/apps/staff/StaffDataTableTest";
// Store Imports
import { useStaffStore } from "@core/domain/store/staffs/staff.store";
import { useAuthStore } from "@/presentation/store/auth.store";

// Helper functions for display text
const getGenderText = (gender: string) => {
  switch (gender) {
    case 'MALE': return 'ຊາຍ';
    case 'FEMALE': return 'ຍິງ';
    default: return 'ອື່ນໆ';
  }
};

const getRoleText = (roleId: number) => {
  switch (roleId) {
    case 1: return 'ຜູ້ດູແລລະບົບ';
    case 2: return 'ພະນັກງານຕ້ອນຮັບ';
    case 3: return 'ພະນັກງານທົ່ວໄປ';
    case 4: return 'ຜູ້ຈັດການ';
    default: return 'ບໍ່ຮູ້';
  }
};

export default function StaffPage() {
  const { items, fetchItems, isLoading } = useStaffStore();
  console.log("Fetched items:", items);
  const [searchValue, setSearchValue] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { user } = useAuthStore();
  // Filtered Items Logic
  const filteredItems = items ? items.filter(staff => {
    const matchesSearch = !searchValue || 
      String(staff.id).includes(searchValue) || 
      (staff.name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
      (staff.userName || '').toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesRole = !roleFilter || 
      (getRoleText(staff?.roleId) || '') === roleFilter;
    
    const matchesGender = !genderFilter || 
      (getGenderText(staff.gender) || '') === genderFilter;
    
    return matchesSearch && matchesRole && matchesGender;
  }) : [];
  
  useEffect(() => {
    console.log("Fetching staff items...");
    fetchItems().then(() => {
      console.log("Fetched items:", items);
    });
  }, [fetchItems]); // ลบ 'items' ออกจาก dependency array
  
  // Filter Handlers
  const handleFilterChange = (value: string) => setSearchValue(value);
  const handleRoleFilterChange = (value: string) => setRoleFilter(value);
  const handleGenderFilterChange = (value: string) => setGenderFilter(value);
  
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
            ຈັດການພະນັກງານ
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
            <StaffFilter
              value={searchValue}
              genderFilter={genderFilter}
              onFilterChange={handleFilterChange}
              onGenderFilterChange={handleGenderFilterChange}
            />
            <StaffRoleFilter
              roleFilter={roleFilter}
              onRoleFilterChange={handleRoleFilterChange}
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
            ເພິ່ມພະນັກງານ
          </Button>
        </Box>
        
        <StaffDataTable
          data={filteredItems}
          loading={isLoading}
          onEdit={handleEdit}
          currentUserRole={user?.role}
        />

        
      </Grid>
      
      <StaffFormInput
        open={formOpen}
        onClose={handleFormClose}
        selectedItem={selectedItem}
      />
    </Grid>
  );
}