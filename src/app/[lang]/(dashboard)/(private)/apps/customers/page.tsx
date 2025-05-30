'use client';

import { useEffect, useState } from 'react';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';

// Component Imports
import CustomerFilter from '@views/apps/customers/dashboard/TableFilter';
import GenderFilterDropdown from '@views/apps/customers/dashboard/GenderFilterDropdown';
import CustomerDataTable from '@views/apps/customers/dashboard/DataTable';
import CustomerFormInput from '@views/apps/customers/dashboard/FormInput';

// Store Imports
import { useCustomerStore } from '@/@core/infrastructure/store/customer/customer.store';
import { Customer } from '@core/domain/models/customer/list.model';

// Helper functions for display text
const getGenderText = (gender: string) => {
  switch (gender?.toUpperCase()) {
    case 'MALE': 
    case 'ชาย': return 'ຊາຍ';
    case 'FEMALE': 
    case 'ຍິງ': return 'ຍິງ';
    default: return 'ອື່ນໆ';
  }
};

export default function CustomerPage() {
  const { items, fetchItems, isLoading } = useCustomerStore();
  const [searchValue, setSearchValue] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Customer | null>(null);
  
  // Filtered Items Logic
  const filteredItems = items ? items.filter(customer => {
    const matchesSearch = !searchValue || 
      String(customer.CustomerId).includes(searchValue) || 
      (customer.CustomerName || '').toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesGender = !genderFilter || 
      (getGenderText(customer.CustomerGender) || '') === genderFilter;
    
    return matchesSearch && matchesGender;
  }) : [];
  
  useEffect(() => {
    console.log("Fetching customer items...");
    fetchItems().then(() => {
      console.log("Customer items loaded successfully");
    }).catch(error => {
      console.error("Error fetching customer items:", error);
    });
  }, [fetchItems]);
  
  // Filter Handlers
  const handleFilterChange = (value: string) => setSearchValue(value);
  const handleGenderFilterChange = (value: string) => setGenderFilter(value);
  
  // Form Handlers
  const handleCreate = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };
  
  const handleEdit = (item: Customer) => {
    setSelectedItem(item);
    setFormOpen(true);
  };
  
  const handleFormClose = () => {
    setSelectedItem(null);
    setFormOpen(false);
  };
  
  return (
    <Grid spacing={4} justifyContent="center">
      <Grid item xs={12} md={10} lg={9}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={600}>
            ຈັດການລູກຄ້າ
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
            <CustomerFilter
              value={searchValue}
              onFilterChange={handleFilterChange}
            />
            <GenderFilterDropdown
              onGenderChange={handleGenderFilterChange}
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
            ເພິ່ມລູກຄ້າ
          </Button>
        </Box>
        
        <CustomerDataTable
          data={filteredItems}
          loading={isLoading}
          onEdit={handleEdit}
        />
        
      </Grid>
      
      <CustomerFormInput
        visible={formOpen}
        onHide={handleFormClose}
        selectedItem={selectedItem}
      />
    </Grid>
  );
}