// src/views/apps/booking/components/BookingActionButtons.tsx
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

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
import Stack from '@mui/material/Stack' // เพิ่ม Stack สำหรับจัดเรียงปุ่ม
import Chip from '@mui/material/Chip' // เพิ่ม Chip สำหรับแสดงสถานะ

// Type Imports
import { Booking } from '@core/domain/models/booking/list.model'

// Toast Import
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../../libs/constants/messages.constant'

interface BookingActionButtonsProps {
  booking: Booking
  onEdit: (booking: Booking) => void
  onDelete: (id: number) => Promise<void>
  onConfirm?: (booking: Booking) => Promise<void>
  currentUserRole?: number
}

const BookingActionButtons = ({ 
  booking, 
  onEdit, 
  onDelete, 
  onConfirm,
  currentUserRole = 0 
}: BookingActionButtonsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  const [canConfirm, setCanConfirm] = useState(false)
  
  // ใช้ useSession hook จาก next-auth/react
  const { data: session } = useSession()
  
  // ฟังก์ชันสำหรับดึงข้อมูล role จาก session
  const getUserRoleFromSession = (): number => {
    try {
      // 1. ตรวจสอบ prop ที่ส่งเข้ามา
      if (currentUserRole !== undefined && currentUserRole > 0) {
        return currentUserRole
      }
      
      // 2. ตรวจสอบจาก next-auth session
      if (session?.user?.roleId) {
        const roleId = typeof session.user.roleId === 'string' 
          ? parseInt(session.user.roleId, 10) 
          : session.user.roleId
        return roleId
      }
      
      // 3. ตรวจสอบจาก sessionStorage
      const sessionData = sessionStorage.getItem('user')
      if (sessionData) {
        const userData = JSON.parse(sessionData)
        if (userData.roleId && typeof userData.roleId === 'number') {
          return userData.roleId
        }
      }
      
      // 4. ตรวจสอบจาก localStorage (zustand persist)
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const authData = JSON.parse(authStorage)
        if (authData.state?.user?.roleId) {
          return authData.state.user.roleId
        }
      }
      
      return 0
    } catch (error) {
      console.error('Error getting user role from session:', error)
      return 0
    }
  }
  
  // ตรวจสอบสิทธิ์การแก้ไข, ลบ และยืนยันการจอง
  useEffect(() => {
    const userRole = getUserRoleFromSession()
  
    const isManager = userRole === 4
    const isAdmin = userRole === 1
    const isReceptionist = userRole === 2
  
    // กำหนดสิทธิ์: 
    // - Admin (roleId=1) สามารถแก้ไข, ลบ และยืนยันได้
    // - Manager (roleId=4) สามารถแก้ไข, ลบ และยืนยันได้
    // - Receptionist (roleId=2) สามารถแก้ไขและยืนยันได้แต่ลบไม่ได้
    setCanEdit(isManager || isAdmin || isReceptionist)
    setCanDelete(isManager || isAdmin)
    setCanConfirm(isManager || isAdmin || isReceptionist)
  }, [booking, currentUserRole, session])
  
  // ตรวจสอบว่าสถานะการจองเป็น "รอการยืนยัน" หรือไม่
  const isPendingConfirmation = () => {
    // สมมติว่า StatusId = 8 คือสถานะ "รอการยืนยัน"
    // ปรับตามค่า StatusId ที่ใช้จริงในระบบของคุณ
    return booking.StatusId === 1
  }
  
  const handleEdit = () => {
    onEdit(booking)
  }
  
  const handleDeleteClick = async () => {
    setDeleteDialogOpen(true)
    return Promise.resolve()
  }
  
  const handleConfirmClick = () => {
    setConfirmDialogOpen(true)
  }
  
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await onDelete(booking.BookingId)
      setDeleteDialogOpen(false)
      toast.success(MESSAGES.SUCCESS.DELETE)
    } catch (error) {
      console.error('Error deleting booking:', error)
      toast.error(MESSAGES.ERROR.DELETE)
    } finally {
      setIsDeleting(false)
    }
  }
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    toast.info(MESSAGES.SUCCESS.CANCElED)
  }
  
  const handleConfirmBooking = async () => {
    try {
      setIsConfirming(true)
      if (onConfirm) {
        await onConfirm(booking)
        toast.success('ຢືນຢັນການຈອງສໍາເລັດແລ້ວ')
      }
      setConfirmDialogOpen(false)
    } catch (error) {
      console.error('Error confirming booking:', error)
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຢືນຢັນການຈອງ')
    } finally {
      setIsConfirming(false)
    }
  }
  
  const handleConfirmCancel = () => {
    setConfirmDialogOpen(false)
    toast.info(MESSAGES.SUCCESS.CANCElED)
  }
  
  // ถ้าเป็นการจองที่รอการยืนยัน ให้แสดง UI พิเศษ
  if (isPendingConfirmation()) {
    return (
      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
        {/* แสดง Chip บอกสถานะรอการยืนยัน */}
       
        
        {/* ปุ่มยืนยันการจอง */}
        <Tooltip title={canConfirm ? 'ຢືນຢັນການຈອງ' : 'ບໍ່ມີສິດການຢືນຢັນ'}>
          <span>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<i className='tabler-check text-lg' />}
              onClick={handleConfirmClick}
              disabled={!canConfirm}
              sx={{ 
                opacity: canConfirm ? 1 : 0.7,
                cursor: canConfirm ? 'pointer' : 'not-allowed',
                minWidth: 'unset',
                px: 1
              }}
            >
           
            </Button>
          </span>
        </Tooltip>
        
        {/* ปุ่มแก้ไข */}
        <Tooltip title={canEdit ? 'ແກ້ໄຂ' : 'ບໍ່ມີສິດການແກ້ໄຂ'}>
          <span>
            <IconButton
              color='primary'
              onClick={handleEdit}
              size='small'
              disabled={!canEdit}
              sx={{ 
                opacity: canEdit ? 1 : 0.5,
                cursor: canEdit ? 'pointer' : 'not-allowed'
              }}
            >
              <i className='tabler-edit text-lg' />
            </IconButton>
          </span>
        </Tooltip>
        
        {/* ปุ่มลบ */}
        <Tooltip title={canDelete ? 'ລົບ' : 'ບໍ່ມີສິດການລົບ'}>
          <span>
            <IconButton
              color='error'
              onClick={handleDeleteClick}
              size='small'
              disabled={!canDelete}
              sx={{ 
                opacity: canDelete ? 1 : 0.5,
                cursor: canDelete ? 'pointer' : 'not-allowed'
              }}
            >
              <i className='tabler-trash text-lg' />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    )
  }
  
  // สำหรับสถานะอื่นๆ แสดง UI ปกติ
  return (
    <>
      <div className='flex items-center justify-center gap-2'>
        <Tooltip title={canEdit ? 'ແກ້ໄຂ' : 'ບໍ່ມີສິດການແກ້ໄຂ'}>
          <span>
            <IconButton
              color='primary'
              onClick={handleEdit}
              size='small'
              disabled={!canEdit}
              sx={{ 
                opacity: canEdit ? 1 : 0.5,
                cursor: canEdit ? 'pointer' : 'not-allowed'
              }}
            >
              <i className='tabler-edit text-lg' />
            </IconButton>
          </span>
        </Tooltip>
        
        <Tooltip title={canDelete ? 'ລົບ' : 'ບໍ່ມີສິດການລົບ'}>
          <span>
            <IconButton
              color='error'
              onClick={handleDeleteClick}
              size='small'
              disabled={!canDelete}
              sx={{ 
                opacity: canDelete ? 1 : 0.5,
                cursor: canDelete ? 'pointer' : 'not-allowed'
              }}
            >
              <i className='tabler-trash text-lg' />
            </IconButton>
          </span>
        </Tooltip>
      </div>
      
      {/* Dialog ยืนยันการลบ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        closeAfterTransition={false}
      >
        <DialogTitle id='alert-dialog-title'>ຢືນຢັນການລົບການຈອງ</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບການຈອງນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button 
            variant='contained' 
            endIcon={<i className='tabler-send' />}
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            ຍົກເລີກ
          </Button>
          <Button 
            variant='contained' 
            color='secondary' 
            startIcon={isDeleting ? <CircularProgress size={20} /> : <i className='tabler-trash' />}
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'ກຳລັງລົບ...' : 'ລົບ'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog ยืนยันการจอง */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmCancel}
        aria-labelledby='confirm-dialog-title'
        aria-describedby='confirm-dialog-description'
        closeAfterTransition={false}
      >
        <DialogTitle id='confirm-dialog-title'>ຢືນຢັນການຈອງ</DialogTitle>
        <DialogContent>
          <DialogContentText id='confirm-dialog-description'>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຢືນຢັນການຈອງນີ້? ການຢືນຢັນຈະປ່ຽນສະຖານະການຈອງເປັນ "ຢືນຢັນແລ້ວ"
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button 
            variant='contained' 
            endIcon={<i className='tabler-x' />}
            onClick={handleConfirmCancel}
            disabled={isConfirming}
          >
            ຍົກເລີກ
          </Button>
          <Button 
            variant='contained' 
            color='success' 
            startIcon={isConfirming ? <CircularProgress size={20} /> : <i className='tabler-check' />}
            onClick={handleConfirmBooking}
            disabled={isConfirming}
          >
            {isConfirming ? 'ກຳລັງຢືນຢັນ...' : 'ຢືນຢັນ'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BookingActionButtons