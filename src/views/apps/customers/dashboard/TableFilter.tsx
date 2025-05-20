'use client'

// MUI Imports
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

// Types
import { CustomerFilterProps } from '@core/domain/models/customer/props.model'

const CustomerFilter = ({ value, onFilterChange }: CustomerFilterProps) => {
  return (
    <TextField
      size="small"
      placeholder="ຄົ້ນຫາລູກຄ້າ..."
      value={value}
      onChange={(e) => onFilterChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        )
      }}
      sx={{ minWidth: { xs: '100%', md: 250 } }}
    />
  )
}

export default CustomerFilter