// RoomActionButtons.tsx - ส่วนที่สอง
import React, { useState } from 'react'
// MUI Imports
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
// Type Imports
import { Room } from '@core/domain/models/rooms/list.model'
// Toast Import
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../../libs/constants/messages.constant'

interface RoomActionButtonsProps {
  room: Room
  onEdit: (room: Room) => void
  onDelete: (id: number) => Promise<void>
}

const RoomActionButtons = ({ room, onEdit, onDelete }: RoomActionButtonsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleEdit = () => {
    onEdit(room)
  }
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await onDelete(room.RoomId)
      setDeleteDialogOpen(false)
      toast.success(MESSAGES.SUCCESS.DELETE) // แสดงข้อความสำเร็จเมื่อลบ
    } catch (error) {
      console.error('Error deleting room:', error)
      toast.error(MESSAGES.ERROR.DELETE) // แสดงข้อความผิดพลาดเมื่อลบไม่สำเร็จ
    } finally {
      setIsDeleting(false)
    }
  }
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    toast.info(MESSAGES.SUCCESS.CANCElED) // แสดงข้อความเมื่อยกเลิก
  }
  
  return (
    <>
      <div className='flex items-center justify-center gap-2'>
        <Tooltip title='ແກ້ໄຂ'>
          <IconButton
            color='primary'
            onClick={handleEdit}
            size='small'
          >
            <i className='tabler-edit text-lg' />
          </IconButton>
        </Tooltip>
        <Tooltip title='ລົບ'>
          <IconButton
            color='error'
            onClick={handleDeleteClick}
            size='small'
          >
            <i className='tabler-trash text-lg' />
          </IconButton>
        </Tooltip>
      </div>
      {/* Dialog ยืนยันการลบ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>ຢືນຢັນການລົບຫ້ອງພັກ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບຫ້ອງພັກນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel} 
            color="primary" 
            disabled={isDeleting}
          >
            ຍົກເລີກ
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'ກຳລັງລົບ...' : 'ລົບ'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RoomActionButtons