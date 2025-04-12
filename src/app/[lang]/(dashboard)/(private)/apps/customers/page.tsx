'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import { useEffect } from 'react'

// Component Imports
import LogisticsOrdersByCountries from '@views/apps/customers/dashboard/LogisticsOrdersByCountries'

// Store Imports
import { useCustomerStore } from '../../../../../../core/presentation/store/customer/customer.store'

const CustomerDashboard = () => {
  // ดึง customers และ fetchCustomers จาก Zustand store
  const { items, fetchCustomers } = useCustomerStore()

  useEffect(() => {
    // ดึงข้อมูล customers เมื่อ component mount
    fetchCustomers()
      .then(() => {
        // แสดงข้อมูลใน console log หลังจากดึงมาสำเร็จ
        // console.log('Customer data:', items)
      })
      .catch(error => {
  
      })
  }, [fetchCustomers])

  // แสดงข้อมูลใน console log อีกครั้งหลังจาก state อัปเดต
  useEffect(() => {
 
  }, [items])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LogisticsOrdersByCountries />
      </Grid>
      {/* สามารถเพิ่ม component อื่นๆ ที่ใช้ข้อมูล customers ได้ที่นี่ */}
    </Grid>
  )
}

export default CustomerDashboard