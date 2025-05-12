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

interface StaffFormInputProps {
  open: boolean
  onClose: () => void
  selectedItem: Staff | null
}

interface StaffInputNoPosition {
  name: string // ฟิลด์ที่ใช้ใน frontend
  StaffName?: string // ฟิลด์ที่ต้องการส่งไปให้ backend
  tel: number
  address: string
  userName: string
  salary: number | null
  gender: string
  password: string
  roleId: number
}

const StaffFormInput = ({ open, onClose, selectedItem }: StaffFormInputProps) => {
  const staffStore = useStaffStore()
  const [showPassword, setShowPassword] = useState(false)
  const isEditMode = Boolean(selectedItem)

  // กำหนดค่าเริ่มต้นสำหรับฟอร์ม
  const defaultValues: StaffInputNoPosition = {
    name: '',
    tel: 0,
    address: '',
    userName: '',
    salary: 0,
    gender: 'MALE',
    password: '',
    roleId: 1
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<StaffInputNoPosition>({
    defaultValues,
    resolver: zodResolver(StaffFormSchema)
  })

  // โหลดข้อมูลพนักงานเมื่ออยู่ในโหมดแก้ไข
  useEffect(() => {
    if (open && selectedItem) {
      console.log('Loading selected staff data:', selectedItem)

      // แปลง roleId เป็นตัวเลขเสมอ
      let roleId = 1
      if (selectedItem.roleId !== undefined && selectedItem.roleId !== null) {
        roleId = typeof selectedItem.roleId === 'string' ? parseInt(selectedItem.roleId, 10) : selectedItem.roleId
      }

      reset({
        name: selectedItem.StaffName || '',
        tel: selectedItem.tel || 0,
        address: selectedItem.address || '',
        userName: selectedItem.userName || '',
        salary: selectedItem.salary || 0,
        gender: selectedItem.gender || 'MALE',
        password: '', // ไม่ใส่รหัสผ่านเดิม
        roleId: roleId
      })
    } else if (open) {
      console.log('Resetting form to defaults')
      reset(defaultValues)
    }
  }, [open, selectedItem, reset])

  const onSubmit = async (data: StaffInputNoPosition) => {
    try {
      console.log('Submitting form data:', data)

      // แปลงข้อมูลพื้นฐานที่ทุกกรณีต้องส่ง
      const baseData = {
        StaffName: data.name,
        tel: data.tel,
        address: data.address,
        userName: data.userName,
        salary: data.salary,
        gender: data.gender,
        roleId: data.roleId
      }

      if (isEditMode && selectedItem) {
        // เพิ่ม check ว่า selectedItem ไม่ใช่ null
        // กรณีแก้ไขข้อมูล
        if (data.password) {
          // ถ้ามีการกรอกรหัสผ่านใหม่
          await staffStore.update(selectedItem.StaffId, {
            ...baseData,
            password: data.password
          })
        } else {
          // ถ้าไม่มีการเปลี่ยนรหัสผ่าน
          // เพิ่มฟิลด์ password เป็นค่าว่างหรือค่าพิเศษ
          await staffStore.update(selectedItem.StaffId, {
            ...baseData,
            password: '**UNCHANGED**' // ใช้ค่าพิเศษที่ backend จะตรวจจับและไม่อัพเดทรหัสผ่าน
          })
        }
      } else {
        // กรณีสร้างใหม่ จำเป็นต้องมี password
        await staffStore.create({
          ...baseData,
          password: data.password
        })
      }

      toast.success(isEditMode ? MESSAGES.SUCCESS.EDIT : MESSAGES.SUCCESS.SAVE)
      onClose()
    } catch (error) {
      console.error('Error saving staff:', error)
      toast.error(isEditMode ? MESSAGES.ERROR.EDIT : MESSAGES.ERROR.SAVE)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{isEditMode ? 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ' : 'ເພີ່ມພະນັກງານໃໝ່'}</DialogTitle>

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
                        <InputAdornment position='end'>
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
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
                    value={field.value === null ? 0 : field.value}
                    onChange={e => {
                      const value = e.target.value === '' ? 0 : Number(e.target.value)
                      field.onChange(value)
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
                    <Select {...field} label='ເພດ' value={field.value || ''}>
                      <MenuItem value='MALE'>ຊາຍ</MenuItem>
                      <MenuItem value='FEMALE'>ຍິງ</MenuItem>
                      <MenuItem value='OTHER'>ອື່ນໆ</MenuItem>
                    </Select>
                    {errors.gender && <FormHelperText error>{errors.gender.message}</FormHelperText>}
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
                    <Select {...field} label='ສິດການໃຊ້ງານ' value={field.value || 1}>
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

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant='outlined' color='secondary' onClick={onClose} disabled={isSubmitting}>
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
  )
}

export default StaffFormInput
