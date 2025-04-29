// src/views/apps/staff/components/StaffActionButtons.tsx
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
import { Staff } from '@core/domain/models/staffs/list.model'

// Toast Import
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../libs/constants/messages.constant'

interface StaffActionButtonsProps {
  staff: Staff
  onEdit: (staff: Staff) => void
  onDelete: (id: number) => Promise<void>
  currentUserRole?: number // เพิ่ม prop สำหรับตรวจสอบบทบาทผู้ใช้ปัจจุบัน
  
}

const StaffActionButtons = ({ staff, onEdit, onDelete, currentUserRole = 0 }: StaffActionButtonsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // ตรวจสอบว่าผู้ใช้ปัจจุบันเป็น Manager (roleId = 4) หรือไม่
  const isManager = currentUserRole === 4;
  
  // ตรวจสอบว่าผู้ใช้ปัจจุบันเป็น Manager หรือมีชื่อบทบาทเป็น "manager"
  const canEdit = isManager || (
    staff.role?.name?.toLowerCase() === 'manager' || 
    getRoleName(staff.roleId).toLowerCase() === 'manager'
  );

  function getRoleName(roleId: number): string {
    switch (roleId) {
      case 1: return 'admin';
      case 2: return 'receptionist';
      case 3: return 'staff';
      case 4: return 'manager';
      default: return 'unknown';
    }
  }
  
  const handleEdit = () => {
    onEdit(staff)
  }
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await onDelete(staff.id)
      setDeleteDialogOpen(false)
      toast.success(MESSAGES.SUCCESS.DELETE) // แสดงข้อความสำเร็จเมื่อลบ
    } catch (error) {
      console.error('Error deleting staff:', error)
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
        <Tooltip title={canEdit ? 'ແກ້ໄຂ' : 'ສະເພາະຜູ້ຈັດການເທົ່ານັ້ນ'}>
          <span> {/* ครอบด้วย span เพื่อให้ Tooltip ทำงานแม้ปุ่มจะถูก disabled */}
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
        <DialogTitle>ຢືນຢັນການລົບພະນັກງານ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບພະນັກງານນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
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

export default StaffActionButtons