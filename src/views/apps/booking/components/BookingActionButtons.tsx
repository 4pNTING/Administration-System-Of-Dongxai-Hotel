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

// Type Imports
import { Booking } from '@core/domain/models/booking/list.model'

// Toast Import
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../../libs/constants/messages.constant'

interface BookingActionButtonsProps {
  booking: Booking
  onEdit: (booking: Booking) => void
  onDelete: (id: number) => Promise<void>
  currentUserRole?: number
}

const BookingActionButtons = ({ booking, onEdit, onDelete, currentUserRole = 0 }: BookingActionButtonsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  
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
  
  // ตรวจสอบสิทธิ์การแก้ไขและลบ
  useEffect(() => {
    const userRole = getUserRoleFromSession()
  
    const isManager = userRole === 4
    const isAdmin = userRole === 1
    const isReceptionist = userRole === 2
  
    // กำหนดสิทธิ์: 
    // - Admin (roleId=1) สามารถแก้ไขและลบได้
    // - Manager (roleId=4) สามารถแก้ไขและลบได้
    // - Receptionist (roleId=2) สามารถแก้ไขได้แต่ลบไม่ได้
    setCanEdit(isManager || isAdmin || isReceptionist)
    setCanDelete(isManager || isAdmin)
  }, [booking, currentUserRole, session]) // เพิ่ม session เข้าไปใน dependencies
  
  const handleEdit = () => {
    onEdit(booking)
  }
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
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
      
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>ຢືນຢັນການລົບການຈອງ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບການຈອງນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
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

export default BookingActionButtons