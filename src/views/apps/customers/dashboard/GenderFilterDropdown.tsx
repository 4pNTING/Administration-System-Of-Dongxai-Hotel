'use client'

// MUI Imports
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// Types
import { GenderFilterProps } from '../../../../../src/app/[lang]/(dashboard)/(private)/apps/customers/page'

const GenderFilterDropdown = ({ onGenderChange }: GenderFilterProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    onGenderChange(value === 'all' ? null : value)
  }

  return (
    <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }} size="small">
      <InputLabel id="gender-filter-label">ເພດ</InputLabel>
      <Select
        labelId="gender-filter-label"
        id="gender-filter"
        defaultValue="all"
        label="ເພດ"
        onChange={handleChange}
      >
        <MenuItem value="all">ທັງໝົດ</MenuItem>
        <MenuItem value="ຊາຍ">ຊາຍ</MenuItem>
        <MenuItem value="ຍິງ">ຍິງ</MenuItem>
      </Select>
    </FormControl>
  )
}

export default GenderFilterDropdown