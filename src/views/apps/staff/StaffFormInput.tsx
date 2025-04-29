// src/views/apps/staff/components/StaffFormInput.tsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { MESSAGES } from '../../../libs/constants/messages.constant';
import { useStaffStore } from '@core/domain/store/staffs/staff.store';
import { StaffFormSchema } from '@core/domain/schemas/staff.schema';
import type { StaffInput } from '@core/domain/models/staffs/form.model';
import { Staff } from '@core/domain/models/staffs/list.model';

// MUI Imports
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';

interface StaffFormInputProps {
  open: boolean;
  onClose: () => void;
  selectedItem: Staff | null;
}

const StaffFormInput = ({ open, onClose, selectedItem }: StaffFormInputProps) => {
  const staffStore = useStaffStore();
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = Boolean(selectedItem);
  
  const defaultValues: StaffInput = {
    name: '',
    tel: 0,
    address: '',
    userName: '',
    salary: 0,
    gender: '',
    password: '',
    position: '',
    roleId: 1
  };
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<StaffInput>({
    defaultValues,
    resolver: zodResolver(StaffFormSchema)
  });
  
  // โหลดข้อมูลพนักงานเมื่ออยู่ในโหมดแก้ไข
  useEffect(() => {
    if (open && selectedItem) {
      reset({
        name: selectedItem.name,
        tel: selectedItem.tel,
        address: selectedItem.address,
        userName: selectedItem.userName,
        salary: selectedItem.salary || 0,
        gender: selectedItem.gender,
        password: '', // ไม่ใส่รหัสผ่านเดิม
        position: selectedItem.position || '',
        roleId: selectedItem.roleId
      });
    } else if (open) {
      reset(defaultValues);
    }
  }, [open, selectedItem, reset]);
  
  const onSubmit = async (data: StaffInput) => {
    try {
      // ถ้ารหัสผ่านว่างและอยู่ในโหมดแก้ไข ไม่ต้องส่งฟิลด์รหัสผ่าน
      if (isEditMode && !data.password && selectedItem) {
        const { password, ...dataWithoutPassword } = data;
        await staffStore.update(selectedItem.id, dataWithoutPassword as any);
      } else {
        // กรณีเพิ่มใหม่หรือแก้ไขพร้อมเปลี่ยนรหัสผ่าน
        if (isEditMode && selectedItem) {
          await staffStore.update(selectedItem.id, data);
        } else {
          await staffStore.create(data);
        }
      }
      
      toast.success(isEditMode ? MESSAGES.SUCCESS.EDIT : MESSAGES.SUCCESS.SAVE);
      onClose();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error(isEditMode ? MESSAGES.ERROR.EDIT : MESSAGES.ERROR.SAVE);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ' : 'ເພີ່ມພະນັກງານໃໝ່'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ຊື່ພະນັກງານ'
                    fullWidth
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name='tel'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ເບີໂທລະສັບ'
                    type='number'
                    fullWidth
                    error={Boolean(errors.tel)}
                    helperText={errors.tel?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ທີ່ຢູ່'
                    fullWidth
                    multiline
                    rows={2}
                    error={Boolean(errors.address)}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name='userName'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ຊື່ຜູ້ໃຊ້'
                    fullWidth
                    error={Boolean(errors.userName)}
                    helperText={errors.userName?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={isEditMode ? 'ລະຫັດຜ່ານໃໝ່ (ເວັ້ນວ່າງຖ້າບໍ່ຕ້ອງການປ່ຽນ)' : 'ລະຫັດຜ່ານ'}
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name='position'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ຕຳແໜ່ງ'
                    fullWidth
                    error={Boolean(errors.position)}
                    helperText={errors.position?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name='salary'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ເງິນເດືອນ'
                    type='number'
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>ກີບ</InputAdornment>
                    }}
                    error={Boolean(errors.salary)}
                    helperText={errors.salary?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.gender)}>
                    <InputLabel>ເພດ</InputLabel>
                    <Select {...field} label='ເພດ'>
                      <MenuItem value='MALE'>ຊາຍ</MenuItem>
                      <MenuItem value='FEMALE'>ຍິງ</MenuItem>
                      <MenuItem value='OTHER'>ອື່ນໆ</MenuItem>
                    </Select>
                    {errors.gender && (
                      <FormHelperText error>{errors.gender.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name='roleId'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.roleId)}>
                    <InputLabel>ສິດການໃຊ້ງານ</InputLabel>
                    <Select {...field} label='ສິດການໃຊ້ງານ'>
                      <MenuItem value={1}>ຜູ້ດູແລລະບົບ</MenuItem>
                      <MenuItem value={2}>ພະນັກງານຕ້ອນຮັບ</MenuItem>
                      <MenuItem value={3}>ພະນັກງານທົ່ວໄປ</MenuItem>
                      <MenuItem value={4}>ຜູ້ຈັດການ</MenuItem>
                    </Select>
                    {errors.roleId && (
                      <FormHelperText error>{errors.roleId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={onClose}
            disabled={isSubmitting}
          >
            ຍົກເລີກ
          </Button>
          <Button
            variant='contained'
            type='submit'
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'ກຳລັງບັນທຶກ...' : isEditMode ? 'ອັບເດດ' : 'ບັນທຶກ'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StaffFormInput;