'use client'

import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// Types Imports
import { Customer } from '@core/domain/models/customer/list.model'
import { CustomerDataTableProps } from '@core/domain/models/customer/props.model'

const CustomerDataTable = ({ data, filters, onEdit, loading }: CustomerDataTableProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Filter the data based on the global filter
  const filteredData = data.filter(customer => {
    if (!filters.global?.value) return true
    const searchValue = (filters.global.value as string).toLowerCase()
    return (
      customer.CustomerName.toLowerCase().includes(searchValue) ||
      customer.CustomerAddress.toLowerCase().includes(searchValue) ||
      customer.CustomerTel.toString().includes(searchValue)
    )
  })

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Format date
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Empty state
  if (!loading && filteredData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="body1">ไม่พบข้อมูลลูกค้า</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow>
                  <TableCell>รหัส</TableCell>
                  <TableCell>ชื่อลูกค้า</TableCell>
                  <TableCell>เพศ</TableCell>
                  <TableCell>เบอร์โทรศัพท์</TableCell>
                  <TableCell>ที่อยู่</TableCell>
                  <TableCell>รหัสไปรษณีย์</TableCell>
                  <TableCell>วันที่สร้าง</TableCell>
                  <TableCell>การจัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer) => (
                    <TableRow
                      hover
                      key={customer.CustomerId}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {customer.CustomerId}
                      </TableCell>
                      <TableCell>{customer.CustomerName}</TableCell>
                      <TableCell>
                        <Chip 
                          label={customer.CustomerGender === 'ชาย' ? 'ชาย' : 'หญิง'} 
                          color={customer.CustomerGender === 'ชาย' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{customer.CustomerTel}</TableCell>
                      <TableCell>{customer.CustomerAddress}</TableCell>
                      <TableCell>{customer.CustomerPostcode}</TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          aria-label="edit customer"
                          onClick={() => onEdit(customer)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="แถวต่อหน้า:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
          />
        </Paper>
      )}
    </Box>
  )
}

export default CustomerDataTable