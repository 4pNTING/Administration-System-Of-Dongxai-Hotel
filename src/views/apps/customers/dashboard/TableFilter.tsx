'use client'

// MUI Imports
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'


// Types
import { CustomerFilterProps } from '@core/domain/models/customer/props.model'

const CustomerFilter = ({ value, onFilterChange }: CustomerFilterProps) => {
  return (
    <TextField
      size="small"
      placeholder="ค้นหาลูกค้า..."
      value={value}
      onChange={(e) => onFilterChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
           
          </InputAdornment>
        )
      }}
      sx={{ minWidth: { xs: '100%', md: 250 } }}
    />
  )
}

export default CustomerFilter