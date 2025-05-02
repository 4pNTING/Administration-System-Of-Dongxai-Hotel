'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';

// Component Imports
import { StaffFilter } from '@views/apps/staff/StaffFilter';
import { StaffRoleFilter } from '@views/apps/staff/StaffRoleFilter';
import StaffDataTable from '@views/apps/staff/StaffTable';
import StaffFormInput from '@views/apps/staff/StaffFormInput';

// Store Imports
import { useStaffStore } from '@core/domain/store/staffs/staff.store';

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
  const { items, fetchItems, isLoading: isLoadingStaff } = useStaffStore();
  const [searchValue, setSearchValue] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // ใช้ useSession hook จาก next-auth/react
  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';
  
  // ดึง roleId จาก session (ตรวจสอบทั้ง string และ number)
  const userRoleId = session?.user?.roleId ?  
    (typeof session.user.roleId === 'string' ? parseInt(session.user.roleId, 10) : session.user.roleId) : 0;
  
  // แสดงข้อมูลเพื่อการดีบัก
  useEffect(() => {
    console.log('SESSION INFO:', {
      session,
      status,
      userRoleId
    });
    
    // เก็บข้อมูลใน sessionStorage สำหรับคอมโพเนนต์อื่นๆ
    if (session?.user) {
      sessionStorage.setItem('user', JSON.stringify({
        id: session.user.id,
        userName: session.user.userName,
        roleId: userRoleId,
        role: session.user.role
      }));
    }
  }, [session, status, userRoleId]);
  
  // Filtered Items Logic
  const filteredItems = items ? items.filter(staff => {
    const matchesSearch = !searchValue || 
      String(staff.StaffId).includes(searchValue) || 
      (staff.StaffName || '').toLowerCase().includes(searchValue.toLowerCase()) ||
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
      console.log("Staff items loaded successfully");
    }).catch(error => {
      console.error("Error fetching staff items:", error);
    });
  }, [fetchItems]);
  
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
  
  // // Show loading state while authentication is being checked
  // const isLoading = isLoadingAuth || isLoadingStaff;
  
  // if (isLoadingAuth) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
  //       <CircularProgress />
  //       <Typography sx={{ ml: 2 }}>ກຳລັງກວດສອບສິດການໃຊ້ງານ...</Typography>
  //     </Box>
  //   );
  // }
  
  return (
    <Grid spacing={4} justifyContent="center">
      <Grid item xs={12} md={10} lg={9}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={600}>
            ຈັດການພະນັກງານ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ສິດການໃຊ້ງານປັດຈຸບັນ: {getRoleText(userRoleId)} (ID: {userRoleId})
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
          loading={isLoadingStaff}
          onEdit={handleEdit}
          currentUserRole={userRoleId} // ส่ง userRoleId ที่ได้จาก session
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