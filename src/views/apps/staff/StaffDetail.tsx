// src/views/staffs/StaffDetail.tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useStaffStore } from '@/@core/infrastructure/store/staffs/staff.store'
import { Staff } from '@core/domain/models/staffs/list.model'
import { STAFF_ROUTE } from '@core/infrastructure/api/config/app-routes.config'
import { toast } from 'react-toastify'
import { MESSAGES } from '../../..//libs/constants/messages.constant'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

// Icon Imports
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface StaffDetailProps {
  staffId: number
}

const StaffDetail = ({ staffId }: StaffDetailProps) => {
  const router = useRouter()
  const staffStore = useStaffStore()
  
  const [staff, setStaff] = useState<Staff | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setIsLoading(true)
        const staffData = await staffStore.fetchStaffById(staffId)
        setStaff(staffData)
      } catch (error) {
        console.error('Error fetching staff details:', error)
        toast.error(MESSAGES.ERROR.FETCH)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStaffData()
  }, [staffId, staffStore])
  
  const handleEdit = () => {
    router.push(STAFF_ROUTE.EDIT(staffId))
  }
  
  const handleBack = () => {
    router.push(STAFF_ROUTE.LIST)
  }
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }
  
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await staffStore.delete(staffId)
      toast.success(MESSAGES.SUCCESS.DELETE)
      router.push(STAFF_ROUTE.LIST)
    } catch (error) {
      console.error('Error deleting staff:', error)
      toast.error(MESSAGES.ERROR.DELETE)
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }
  
  if (!staff) {
    return (
      <Card>
        <CardContent>
          <Typography align='center'>ບໍ່ພົບຂໍ້ມູນພະນັກງານ</Typography>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant='contained' onClick={handleBack} startIcon={<ArrowBackIcon />}>
              ກັບຄືນ
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
  }
  
  // แปลงข้อมูลเพศให้แสดงผลเป็นภาษาลาว
  const getGenderText = (gender: string) => {
    switch (gender?.toUpperCase()) {
      case 'MALE': return 'ຊາຍ'
      case 'FEMALE': return 'ຍິງ'
      default: return 'ອື່ນໆ'
    }
  }
  
  // แปลงข้อมูล roleId เป็นข้อความ
  const getRoleText = (roleId: number) => {
    switch (roleId) {
      case 1: return 'ຜູ້ດູແລລະບົບ'
      case 2: return 'ພະນັກງານຕ້ອນຮັບ'
      case 3: return 'ພະນັກງານທົ່ວໄປ'
      default: return 'ບໍ່ຮູ້'
    }
  }
  
  return (
    <Card>
      <CardHeader 
        title='ລາຍລະອຽດພະນັກງານ' 
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <Button
            variant='outlined'
            size='small'
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            ກັບຄືນ
          </Button>
        }
      />
      
      <Divider sx={{ m: '0 !important' }} />
      
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              ຊື່ພະນັກງານ
            </Typography>
            <Typography>{staff.StaffName}</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              ເບີໂທລະສັບ
            </Typography>
            <Typography>{staff.tel}</Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              ທີ່ຢູ່
            </Typography>
            <Typography>{staff.address}</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              ຊື່ຜູ້ໃຊ້
            </Typography>
            <Typography>{staff.userName}</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              ເງິນເດືອນ
            </Typography>
            <Typography>{staff.salary?.toLocaleString() || '-'} ກີບ</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              ເພດ
            </Typography>
            <Typography>{getGenderText(staff.gender)}</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              ສິດການໃຊ້ງານ
            </Typography>
            <Typography>{getRoleText(staff.roleId)}</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              ວັນທີສ້າງ
            </Typography>
            <Typography>
              {staff.createdAt ? new Date(staff.createdAt).toLocaleString('lo-LA') : '-'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              ອັບເດດລ່າສຸດ
            </Typography>
            <Typography>
              {staff.updatedAt ? new Date(staff.updatedAt).toLocaleString('lo-LA') : '-'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      
      <Divider sx={{ m: '0 !important' }} />
      
      <CardActions sx={{ justifyContent: 'flex-end', p: (theme) => theme.spacing(3) }}>
        <Button
          variant='outlined'
          color='primary'
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{ mr: 2 }}
        >
          ແກ້ໄຂ
        </Button>
        <Button
          variant='outlined'
          color='error'
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClick}
        >
          ລົບ
        </Button>
      </CardActions>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>ຢືນຢັນການລົບພະນັກງານ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບພະນັກງານ {staff.StaffName}? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
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
    </Card>
  )
}

export default StaffDetail