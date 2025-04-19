'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

// Types and Schema
import { CustomerFormInputProps } from '@core/domain/models/customer/props.model'
import { CustomerInput } from '@core/domain/models/customer/form.model'
import { CustomerFormSchema } from '@core/domain/schemas/customer.schema'
import { useCustomerStore } from '@core/domain/store/customer/customer.store'

const CustomerFormInput = ({ visible, onHide, selectedItem }: CustomerFormInputProps) => {
  const { create, update, isSubmitting } = useCustomerStore()

  const defaultValues: CustomerInput = {
    CustomerName: '',
    CustomerGender: 'ชาย',
    CustomerTel: undefined,
    CustomerAddress: '',
    CustomerPostcode: undefined
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CustomerInput>({
    defaultValues,
    resolver: zodResolver(CustomerFormSchema)
  })

  // Reset form when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      reset({
        CustomerName: selectedItem.CustomerName,
        CustomerGender: selectedItem.CustomerGender,
        CustomerTel: selectedItem.CustomerTel,
        CustomerAddress: selectedItem.CustomerAddress,
        CustomerPostcode: selectedItem.CustomerPostcode
      })
    } else {
      reset(defaultValues)
    }
  }, [selectedItem, reset])

  const onSubmit = async (data: CustomerInput) => {
    try {
      if (selectedItem) {
        await update(selectedItem.CustomerId, data)
      } else {
        await create(data)
      }
      onHide() // เปลี่ยนจาก onClose เป็น onHide
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleClose = () => {
    reset()
    onHide() // เปลี่ยนจาก onClose เป็น onHide
  }

  return (
    <Dialog 
      open={visible} // เปลี่ยนจาก visible เป็น open สำหรับ Dialog MUI
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>{selectedItem ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มข้อมูลลูกค้า'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Controller
                name="CustomerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ชื่อลูกค้า"
                    variant="outlined"
                    fullWidth
                    error={!!errors.CustomerName}
                    helperText={errors.CustomerName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="CustomerGender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.CustomerGender}>
                    <InputLabel>เพศ</InputLabel>
                    <Select {...field} label="เพศ">
                      <MenuItem value="ชาย">ชาย</MenuItem>
                      <MenuItem value="หญิง">หญิง</MenuItem>
                    </Select>
                    {errors.CustomerGender && (
                      <FormHelperText>{errors.CustomerGender.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="CustomerTel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="เบอร์โทรศัพท์"
                    variant="outlined"
                    fullWidth
                    type="number"
                    error={!!errors.CustomerTel}
                    helperText={errors.CustomerTel?.message}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="CustomerPostcode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="รหัสไปรษณีย์"
                    variant="outlined"
                    fullWidth
                    type="number"
                    error={!!errors.CustomerPostcode}
                    helperText={errors.CustomerPostcode?.message}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="CustomerAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ที่อยู่"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.CustomerAddress}
                    helperText={errors.CustomerAddress?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            ยกเลิก
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CustomerFormInput