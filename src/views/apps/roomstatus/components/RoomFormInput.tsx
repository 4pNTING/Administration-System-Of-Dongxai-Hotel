import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

// Store Imports
import { useRoomStore } from '@core/domain/store/rooms/room.store'
import { useRoomTypeStore } from '@core/domain/store/roomType.store'
import { useRoomStatusStore } from '@core/domain/store/room-status.store'

// Schema Imports
import { RoomFormSchema } from '@core/domain/schemas/room.schema'
import { Room } from '@core/domain/models/rooms/list.model'
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../../libs/constants/messages.constant'
interface RoomFormInputProps {
  open: boolean
  onClose: () => void
  selectedItem: Room | null
}

const RoomFormInput: React.FC<RoomFormInputProps> = ({ open, onClose, selectedItem }) => {
  // ดึงข้อมูลประเภทห้องและสถานะห้อง
  const { roomTypes, fetchRoomTypes } = useRoomTypeStore()
  const { roomStatuses, fetchRoomStatuses } = useRoomStatusStore()
  const { create, update, fetchItems } = useRoomStore()

  // สถานะสำหรับแสดงการโหลด
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ฟอร์มคอนโทรล
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(RoomFormSchema),
    defaultValues: {
      TypeId: 0,
      StatusId: 0,
      RoomPrice: 0
    }
  })

  // เมื่อคอมโพเนนต์ถูกโหลดให้ดึงข้อมูลประเภทห้องและสถานะห้อง
  useEffect(() => {
    fetchRoomTypes()
    fetchRoomStatuses()
  }, [fetchRoomTypes, fetchRoomStatuses])

  // เมื่อมีการเลือกข้อมูลห้องที่ต้องการแก้ไข ให้นำข้อมูลมาเติมในฟอร์ม
  useEffect(() => {
    if (selectedItem) {
      reset({
        TypeId: selectedItem.roomType?.TypeId || 0,
        StatusId: selectedItem.roomStatus?.StatusId || 0,
        RoomPrice: selectedItem.RoomPrice
      })
    } else {
      reset({
        TypeId: 0,
        StatusId: 0,
        RoomPrice: 0
      })
    }
  }, [selectedItem, reset])

  const onSubmit = async (data: any) => {
    try {
      const formData = {
        TypeId: data.TypeId,
        StatusId: data.StatusId,
        RoomPrice: data.RoomPrice
      }
      
      if (selectedItem) {
        await update(selectedItem.RoomId, formData)
        toast.success(MESSAGES.SUCCESS.EDIT) 
      } else {
        await create(formData)
        toast.success(MESSAGES.SUCCESS.SAVE) 
      }
  
      onClose()
    } catch (error) {
      console.error('Error saving form:', error)
      
      toast.error(selectedItem ? MESSAGES.ERROR.EDIT : MESSAGES.ERROR.SAVE)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>{selectedItem ? 'ແກ້ໄຂຂໍ້ມູນຫ້ອງພັກ' : 'ເພີ່ມຂໍ້ມູນຫ້ອງພັກ'}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* ประเภทห้อง */}
            <Grid item xs={12}>
              <Controller
                name='TypeId'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.TypeId}>
                    <InputLabel id='room-type-select-label'>ປະເພດຫ້ອງ</InputLabel>
                    <Select {...field} labelId='room-type-select-label' label='ປະເພດຫ້ອງ'>
                      <MenuItem value={0} disabled>
                        <em>ເລືອກປະເພດຫ້ອງ</em>
                      </MenuItem>
                      {roomTypes.map(type => (
                        <MenuItem key={type.TypeId} value={type.TypeId}>
                          {type.TypeName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.TypeId && <FormHelperText>{errors.TypeId.message?.toString()}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* สถานะห้อง */}
            <Grid item xs={12}>
              <Controller
                name='StatusId'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.StatusId}>
                    <InputLabel id='room-status-select-label'>ສະຖານະຫ້ອງ</InputLabel>
                    <Select {...field} labelId='room-status-select-label' label='ສະຖານະຫ້ອງ'>
                      <MenuItem value={0} disabled>
                        <em>ເລືອກສະຖານະຫ້ອງ</em>
                      </MenuItem>
                      {roomStatuses.map(status => (
                        <MenuItem key={status.StatusId} value={status.StatusId}>
                          {status.StatusName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.StatusId && <FormHelperText>{errors.StatusId.message?.toString()}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* ราคาห้อง */}
            <Grid item xs={12}>
              <Controller
                name='RoomPrice'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ລາຄາຫ້ອງ'
                    variant='outlined'
                    fullWidth
                    type='number'
                    // เพิ่มส่วนนี้เพื่อแปลงค่าเป็น number
                    onChange={e => {
                      const value = e.target.value
                      field.onChange(value === '' ? 0 : Number(value))
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>₭</InputAdornment>
                    }}
                    error={!!errors.RoomPrice}
                    helperText={errors.RoomPrice?.message?.toString()}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color='secondary'>
            ຍົກເລີກ
          </Button>
          <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
            {isSubmitting ? 'ກຳລັງບັນທຶກ...' : selectedItem ? 'ອັບເດດ' : 'ບັນທຶກ'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RoomFormInput
