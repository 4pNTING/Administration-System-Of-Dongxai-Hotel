'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// Icon Imports
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'

// Component Imports
import BookingDataTable from '@views/apps/booking/RoomTable'
import BookingFormInput from '@views/apps/booking/components/BookingFormInput'
import BookingStatusChip from '@views/apps/booking/components/BookingStatus'

// Store Imports
import { useBookingStore } from '@core/domain/store/booking/booking.store'
import { useBookingStatusStore } from '@core/domain/store/booking/booking-status.store'
import { Booking } from '@core/domain/models/booking/list.model'

// Function to render TabPanel content
function TabPanel(props: {
  children?: React.ReactNode
  index: number
  value: number
}) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const BookingPage = () => {
  const { 
    items: bookings, 
    fetchItems: fetchBookings, 
    isLoading, 
    isSubmitting
  } = useBookingStore()
  
  const {
    bookingStatuses,
    fetchBookingStatuses
  } = useBookingStatusStore()
  
  const [tabValue, setTabValue] = useState(0)
  const [statusFilter, setStatusFilter] = useState<number | string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [visible, setVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Booking | null>(null)
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  // ดึงข้อมูลเมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadError(null)
        await fetchBookings()
        await fetchBookingStatuses()
      } catch (error) {
        console.error("Failed to load booking data:", error)
        setLoadError(error instanceof Error ? error.message : 'Failed to load booking data')
      }
    }
    
    loadData()
  }, [fetchBookings, fetchBookingStatuses])

  // อัปเดตข้อมูลที่กรองเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (bookings && Array.isArray(bookings)) {
      let result = [...bookings]
      
      // กรองตามแท็บที่เลือก
      if (tabValue === 1) { // แท็บการจองที่กำลังดำเนินการ (Active)
        result = result.filter(booking => {
          const status = booking.bookingStatus?.StatusName || ''
          return !status.includes('ຍົກເລີກ') && !status.includes('ສຳເລັດແລ້ວ')
        })
      } else if (tabValue === 2) { // แท็บการจองที่เสร็จสิ้นแล้ว (Completed)
        result = result.filter(booking => {
          const status = booking.bookingStatus?.StatusName || ''
          return status.includes('ສຳເລັດແລ້ວ')
        })
      } else if (tabValue === 3) { // แท็บการจองที่ถูกยกเลิก (Cancelled)
        result = result.filter(booking => {
          const status = booking.bookingStatus?.StatusName || ''
          return status.includes('ຍົກເລີກ')
        })
      }
      
      // กรองตามสถานะที่เลือก
      if (statusFilter !== 'all') {
        result = result.filter(booking => booking.StatusId === statusFilter)
      }
      
      // กรองตามคำค้นหา
      if (searchTerm && searchTerm.trim() !== '') {
        const searchLower = searchTerm.toLowerCase()
        result = result.filter(booking => {
          const bookingId = `B${String(booking.BookingId).padStart(3, '0')}`.toLowerCase()
          const customerName = booking.customer?.CustomerName?.toLowerCase() || ''
          const roomId = String(booking.room?.RoomId || '').toLowerCase()
          
          return (
            bookingId.includes(searchLower) ||
            customerName.includes(searchLower) ||
            roomId.includes(searchLower)
          )
        })
      }
      
      setFilteredBookings(result)
    } else {
      setFilteredBookings([])
    }
  }, [bookings, tabValue, statusFilter, searchTerm])

  // จัดการการเปลี่ยนแปลงแท็บ
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // จัดการการสร้างรายการใหม่
  const handleCreate = () => {
    setSelectedItem(null)
    setVisible(true)
  }

  // จัดการการแก้ไขรายการ
  const handleEdit = (item: Booking) => {
    setSelectedItem(item)
    setVisible(true)
  }

  // จัดการการปิดแบบฟอร์ม
  const handleHide = () => {
    setSelectedItem(null)
    setVisible(false)
    // โหลดข้อมูลใหม่หลังจากปิดฟอร์ม เพื่อให้แน่ใจว่าข้อมูลเป็นปัจจุบัน
    fetchBookings()
  }

  // จัดการการรีเฟรชข้อมูล
  const handleRefresh = async () => {
    try {
      setLoadError(null)
      await fetchBookings()
    } catch (error) {
      console.error("Failed to refresh booking data:", error)
      setLoadError(error instanceof Error ? error.message : 'Failed to refresh booking data')
    }
  }

  // ตรวจสอบว่ามีข้อมูลหรือไม่
  const hasData = Array.isArray(bookings) && bookings.length > 0

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {loadError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loadError}
          </Alert>
        )}
        
        <Card>
          <CardHeader
            title={<Typography variant='h5'>ການຈັດການການຈອງ</Typography>}
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={handleRefresh}
                  startIcon={<RefreshIcon />}
                  disabled={isLoading}
                >
                  ໂຫລດຂໍ້ມູນໃໝ່
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleCreate}
                  startIcon={<AddIcon />}
                  disabled={isSubmitting}
                >
                  ເພີ່ມການຈອງໃໝ່
                </Button>
              </Box>
            }
          />

          <Divider />

          <CardContent>
            <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="ຄົ້ນຫາ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ width: 240 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel id="status-filter-label">ສະຖານະ</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="ສະຖານະ"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1, ml: -0.5 }} />}
                >
                  <MenuItem value="all">ທັງໝົດ</MenuItem>
                  {bookingStatuses.map(status => (
                    <MenuItem key={status.StatusId} value={status.StatusId}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BookingStatusChip status={status} />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* แท็บสำหรับแยกประเภทการจอง */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                aria-label="booking tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="ທັງໝົດ" />
                <Tab label="ກຳລັງດຳເນີນການ" />
                <Tab label="ສຳເລັດແລ້ວ" />
                <Tab label="ຍົກເລີກແລ້ວ" />
              </Tabs>
            </Box>
            
            {/* เนื้อหาของแต่ละแท็บ */}
            <TabPanel value={tabValue} index={0}>
              {renderBookingTable()}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {renderBookingTable()}
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              {renderBookingTable()}
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              {renderBookingTable()}
            </TabPanel>
          </CardContent>
        </Card>
      </Grid>

      <BookingFormInput 
        open={visible} 
        onClose={handleHide} 
        selectedItem={selectedItem} 
        onSaved={fetchBookings}
      />
    </Grid>
  )

  // ฟังก์ชันสำหรับแสดงตารางการจอง
  function renderBookingTable() {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      )
    } 
    
    if (!hasData) {
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          ບໍ່ພົບຂໍ້ມູນການຈອງ. ກະລຸນາເພີ່ມການຈອງໃໝ່.
        </Alert>
      )
    }
    
    if (filteredBookings.length === 0) {
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          ບໍ່ພົບຂໍ້ມູນການຈອງທີ່ຕົງກັບການຄົ້ນຫາ.
        </Alert>
      )
    }
    
    return (
      <BookingDataTable
        data={filteredBookings}
        onEdit={handleEdit}
        loading={isLoading}
        currentUserRole={5} // สมมติให้เป็น Role ID 5 (ผู้จัดการ)
      />
    )
  }
}

export default BookingPage