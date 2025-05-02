// src/views/apps/staff/components/StaffActionButtons.tsx
import React, { useState, useEffect } from 'react'

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
  currentUserRole?: number
}

const StaffActionButtons = ({ staff, onEdit, onDelete, currentUserRole = 0 }: StaffActionButtonsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  
  // ฟังก์ชันสำหรับดึงข้อมูล role จาก session
  const getUserRoleFromSession = (): number => {
    try {
      // First try to get role from currentUserRole prop
      if (currentUserRole !== undefined && currentUserRole > 0) {
        return currentUserRole;
      }
      
      // Then try to get role from session storage
      const sessionData = sessionStorage.getItem('user');
      if (sessionData) {
        const userData = JSON.parse(sessionData);
        // Make sure we're checking roleId, not role
        if (userData.roleId && typeof userData.roleId === 'number') {
          return userData.roleId;
        }
      }
      
      // Finally try auth-storage from localStorage (used by zustand persist)
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const authData = JSON.parse(authStorage);
        if (authData.state && authData.state.user && authData.state.user.roleId) {
          return authData.state.user.roleId;
        }
      }
      
      return 0;
    } catch (error) {
      console.error('Error getting user role from session:', error);
      return 0;
    }
  };
  
  // ตรวจสอบสิทธิ์การแก้ไขและลบเมื่อ component โหลดหรือเมื่อ props เปลี่ยนแปลง
  useEffect(() => {
    const userRole = getUserRoleFromSession();
  
    const isManager = userRole === 4;
    const isAdmin = userRole === 1;
    
    // Ensure staff.roleId exists and is a number
    const staffRoleId = typeof staff.roleId === 'number' ? staff.roleId : 0;
  
    console.log('Permission check:', {
      userRoleFromSession: userRole,
      providedRole: currentUserRole,
      isManager,
      isAdmin,
      staffRoleId,
    });
  
    // Admin can edit all, Manager can edit all
    // For delete, only Manager can delete
    setCanEdit(isManager || isAdmin);
    setCanDelete(isManager);
  }, [staff, currentUserRole]); // Add full staff object to dependencies
  
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
        <Tooltip title={canEdit ? 'ແກ້ໄຂ' : 'ບໍ່ມີສິດການແກ້ໄຂ'}>
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
        
        <Tooltip title={canDelete ? 'ລົບ' : 'ສະເພາະຜູ້ຈັດການເທົ່ານັ້ນທີ່ສາມາດລົບໄດ້'}>
          <span> {/* ครอบด้วย span เพื่อให้ Tooltip ทำงานแม้ปุ่มจะถูก disabled */}
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