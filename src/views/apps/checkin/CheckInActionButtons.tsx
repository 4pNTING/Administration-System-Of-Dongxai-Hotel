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
import { CheckIn } from '@core/domain/models/checkin/list.model'

// Toast Import
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../libs/constants/messages.constant'

interface CheckInActionButtonsProps {
  checkIn: CheckIn
  onEdit: (checkIn: CheckIn) => void
  onDelete: (id: number) => Promise<void>
  currentUserRole?: number
}

const CheckInActionButtons = ({ 
  checkIn, 
  onEdit, 
  onDelete,
  currentUserRole = 0 
}: CheckInActionButtonsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  
  const { data: session } = useSession()
  
  const getUserRoleFromSession = (): number => {
    try {
      if (currentUserRole !== undefined && currentUserRole > 0) {
        return currentUserRole
      }
      
      if (session?.user?.roleId) {
        const roleId = typeof session.user.roleId === 'string' 
          ? parseInt(session.user.roleId, 10) 
          : session.user.roleId
        return roleId
      }
      
      const sessionData = sessionStorage.getItem('user')
      if (sessionData) {
        const userData = JSON.parse(sessionData)
        if (userData.roleId && typeof userData.roleId === 'number') {
          return userData.roleId
        }
      }
      
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
  
  useEffect(() => {
    const userRole = getUserRoleFromSession()
  
    const isManager = userRole === 4
    const isAdmin = userRole === 1
    const isReceptionist = userRole === 2
  
    setCanEdit(isManager || isAdmin || isReceptionist)
    setCanDelete(isManager || isAdmin)
  }, [checkIn, currentUserRole, session])
  
  const hasCheckOut = checkIn.checkOuts && checkIn.checkOuts.length > 0
  
  const handleEdit = () => {
    onEdit(checkIn)
  }
  
  const handleDeleteClick = async () => {
    setDeleteDialogOpen(true)
    return Promise.resolve()
  }
  
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await onDelete(checkIn.CheckInId)
      setDeleteDialogOpen(false)
      toast.success(MESSAGES.SUCCESS.DELETE)
    } catch (error) {
      console.error('Error deleting check-in:', error)
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
        {/* ปุ่มแก้ไข */}
        <Tooltip title={canEdit ? 'ແກ້ໄຂ' : 'ບໍ່ມີສິດການແກ້ໄຂ'}>
          <span>
            <IconButton
              color='primary'
              onClick={handleEdit}
              size='small'
              disabled={!canEdit}
              sx={{ 
                opacity: canEdit ? 1 : 0.3,
                cursor: canEdit ? 'pointer' : 'not-allowed'
              }}
            >
              <i className='tabler-edit text-lg' />
            </IconButton>
          </span>
        </Tooltip>
        
        {/* ปุ่มลบ - แสดงเฉพาะเมื่อยังไม่ checkout */}
        <Tooltip title={
          hasCheckOut 
            ? 'ບໍ່ສາມາດລົບໄດ້ ເນື່ອງຈາກມີການເຊັກເອົາແລ້ວ' 
            : canDelete 
              ? 'ລົບ' 
              : 'ບໍ່ມີສິດການລົບ'
        }>
          <span>
            <IconButton
              color='error'
              onClick={handleDeleteClick}
              size='small'
              disabled={!canDelete || hasCheckOut}
              sx={{ 
                opacity: (canDelete && !hasCheckOut) ? 1 : 0.3,
                cursor: (canDelete && !hasCheckOut) ? 'pointer' : 'not-allowed'
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
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle id='alert-dialog-title'>ຢືນຢັນການລົບການເຊັກອິນ</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບການເຊັກອິນນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense' sx={{ p: 3, pt: 1 }}>
          <Button 
            variant='outlined' 
            onClick={handleDeleteCancel}
            disabled={isDeleting}
            sx={{ minWidth: 100 }}
          >
            ຍົກເລີກ
          </Button>
          <Button 
            variant='contained' 
            color='error' 
            startIcon={isDeleting ? <CircularProgress size={20} /> : <i className='tabler-trash' />}
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            sx={{ minWidth: 120 }}
          >
            {isDeleting ? 'ກຳລັງລົບ...' : 'ລົບ'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CheckInActionButtons