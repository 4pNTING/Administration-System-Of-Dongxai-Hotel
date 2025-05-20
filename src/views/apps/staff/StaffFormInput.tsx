// src/views/apps/staff/components/StaffFormInput.tsx
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../libs/constants/messages.constant'
import { useStaffStore } from '@core/domain/store/staffs/staff.store'
import { StaffFormSchema } from '@core/domain/schemas/staff.schema'
import { Staff } from '@core/domain/models/staffs/list.model'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

interface StaffFormInputProps {
  open: boolean
  onClose: () => void
  selectedItem: Staff | null
  onSaved?: () => void
}

// กำหนดฟอร์มอินพุท
interface StaffInputForm {
  name: string
  tel: number
  address: string
  userName: string
  salary: number | null
  gender: string
  password: string
  roleId: number
}

const StaffFormInput = ({ open, onClose, selectedItem }: StaffFormInputProps) => {
  // ใช้ Store ทั้งหมด
  const { 
    create, 
    update,
    fetchItems, 
    isSubmitting, 
    reset: resetStore 
  } = useStaffStore()
  
  const [showPassword, setShowPassword] = useState(false)
  const isEditMode = Boolean(selectedItem)

  // กำหนดค่าเริ่มต้น
  const defaultValues: StaffInputForm = {
    name: '',
    tel: 0,
    address: '',
    userName: '',
    salary: 0,
    gender: 'MALE',
    password: '',
    roleId: 1
  }

  const { control, handleSubmit, reset, formState: { errors } } = useForm<StaffInputForm>({
    defaultValues,
    resolver: zodResolver(StaffFormSchema)
  })

  // โหลดข้อมูลพนักงานเมื่ออยู่ในโหมดแก้ไข
  useEffect(() => {
    if (open && selectedItem) {
      reset({
        name: selectedItem.StaffName || '',
        tel: typeof selectedItem.tel === 'string' ? parseInt(selectedItem.tel, 10) : (selectedItem.tel || 0),
        address: selectedItem.address || '',
        userName: selectedItem.userName || '',
        salary: typeof selectedItem.salary === 'string' ? Number(selectedItem.salary) : (selectedItem.salary || 0),
        gender: selectedItem.gender || 'MALE',
        password: '',
        roleId: typeof selectedItem.roleId === 'string' ? parseInt(selectedItem.roleId, 10) : (selectedItem.roleId || 1)
      })
    } else if (open) {
      reset(defaultValues)
    }
  }, [open, selectedItem, reset])

  // จัดการปิดฟอร์ม - รีเซ็ตทั้ง form และ store
  const handleClose = () => {
    reset(defaultValues)
    resetStore()
    onClose()
  }

  // ส่งข้อมูลฟอร์มไปยัง API
  const onSubmit = async (data: StaffInputForm) => {
    try {
      // เตรียมข้อมูลพนักงาน
      const staffData = {
        StaffName: data.name,
        gender: data.gender,
        tel: +data.tel,
        address: data.address,
        salary: +(data.salary || 0),
        roleId: +data.roleId
      }

      if (isEditMode && selectedItem) {
        // อัปเดตพนักงาน
        await update(selectedItem.StaffId, {
          ...staffData,
          userName: selectedItem.userName, // ใช้ userName เดิม
          password: data.password || '**UNCHANGED**'
        })
        toast.success(MESSAGES.SUCCESS.EDIT)
      } else {
        // สร้างพนักงานใหม่
        await create({
          ...staffData,
          userName: data.userName,
          password: data.password
        })
        toast.success(MESSAGES.SUCCESS.SAVE)
      }
      
      // โหลดข้อมูลใหม่จาก API
      await fetchItems()
      
      // ปิดฟอร์ม
      handleClose()
    } catch (error) {
      console.error('Error saving staff:', error)
      toast.error(isEditMode ? MESSAGES.ERROR.EDIT : MESSAGES.ERROR.SAVE)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
        {isEditMode ? 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ' : 'ເພີ່ມພະນັກງານໃໝ່'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }}>ຂໍ້ມູນພະນັກງານ</Divider>
            </Grid>

            {/* ชื่อพนักงาน */}
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
                    InputProps={{ sx: { borderRadius: 1 } }}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* เบอร์โทรศัพท์ */}
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
                    value={field.value === null ? 0 : field.value}
                    onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    error={Boolean(errors.tel)}
                    helperText={errors.tel?.message}
                    InputProps={{ sx: { borderRadius: 1 } }}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* ที่อยู่ */}
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
                    InputProps={{ sx: { borderRadius: 1 } }}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* เพศ */}
            <Grid item xs={12} md={6}>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.gender)} disabled={isSubmitting}>
                    <InputLabel>ເພດ</InputLabel>
                    <Select {...field} label='ເພດ' value={field.value || ''} sx={{ borderRadius: 1 }}>
                      <MenuItem value='MALE'>ຊາຍ</MenuItem>
                      <MenuItem value='FEMALE'>ຍິງ</MenuItem>
                      <MenuItem value='OTHER'>ອື່ນໆ</MenuItem>
                    </Select>
                    {errors.gender && <FormHelperText error>{errors.gender.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* เงินเดือน */}
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
                      endAdornment: <InputAdornment position='end'>ກີບ</InputAdornment>,
                      sx: { borderRadius: 1 }
                    }}
                    value={field.value === null ? 0 : field.value}
                    onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    error={Boolean(errors.salary)}
                    helperText={errors.salary?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>ຂໍ້ມູນເຂົ້າສູ່ລະບົບ</Divider>
            </Grid>

            {/* ชื่อผู้ใช้ */}
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
                  
                    InputProps={{
                      readOnly: isEditMode, // เพิ่ม readOnly เมื่ออยู่ในโหมดแก้ไข
                      sx: {
                        borderRadius: 1,
                        bgcolor: isEditMode ? 'rgba(0, 0, 0, 0.04)' : 'inherit' // เพิ่มสีพื้นหลังเทาเมื่อเป็น readOnly
                      }
                    }}
                    disabled={isSubmitting || isEditMode}
                  />
                )}
              />
            </Grid>

            {/* รหัสผ่าน */}
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
                        <InputAdornment position='end'>
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge='end' disabled={isSubmitting}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 1 }
                    }}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* บทบาท */}
            <Grid item xs={12} md={6}>
              <Controller
                name='roleId'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.roleId)} disabled={isSubmitting}>
                    <InputLabel>ສິດການໃຊ້ງານ</InputLabel>
                    <Select {...field} label='ສິດການໃຊ້ງານ' value={field.value || 1} sx={{ borderRadius: 1 }}>
                      <MenuItem value={1}>ຜູ້ດູແລລະບົບ</MenuItem>
                      <MenuItem value={2}>ພະນັກງານຕ້ອນຮັບ</MenuItem>
                      <MenuItem value={3}>ພະນັກງານທົ່ວໄປ</MenuItem>
                      <MenuItem value={4}>ຜູ້ຈັດການ</MenuItem>
                    </Select>
                    {errors.roleId && <FormHelperText error>{errors.roleId.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid #eee', pt: 2 }}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{ borderRadius: 1, textTransform: 'none' }}
          >
            ຍົກເລີກ
          </Button>
          <Button
            variant='contained'
            type='submit'
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            sx={{ borderRadius: 1, ml: 2, textTransform: 'none' }}
          >
            {isSubmitting ? 'ກຳລັງບັນທຶກ...' : isEditMode ? 'ອັບເດດ' : 'ບັນທຶກ'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default StaffFormInput