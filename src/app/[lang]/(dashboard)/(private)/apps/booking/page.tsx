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

// Component Imports
import CustomerDataTable from '@views/apps/customers/dashboard/DataTable'
import CustomerFormInput from '@views/apps/customers/dashboard/FormInput'
import CustomerFilter from '@views/apps/customers/dashboard/TableFilter'

import GenderFilterDropdown from '@views/apps/customers/dashboard/GenderFilterDropdown'

// Store Imports
import { useCustomerStore } from '@core/domain/store/customer/customer.store'
import { Customer } from '@core/domain/models/customer/list.model'

export interface GenderFilterProps {
  onGenderChange: (gender: string | null) => void
}

const CustomerPage = () => {
  const { items, fetchItems, isLoading } = useCustomerStore()
  const [filters, setFilters] = useState<Record<string, any>>({
    global: { value: null, matchMode: 'contains' }
  })
  const [visible, setVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Customer | null>(null)
  const [filteredItems, setFilteredItems] = useState<Customer[]>([])
  const [selectedGender, setSelectedGender] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    if (items) {
      console.log('Fetched items:', items)
      if (selectedGender === null) {
        setFilteredItems(items)
      } else {
        const filtered = items.filter((item) => item.CustomerGender === selectedGender)
        setFilteredItems(filtered)
      }
    }
  }, [items, selectedGender])

  const onGlobalFilterChange = (value: string) => {
    const _filters = { ...filters }
    ;(_filters['global'] as any).value = value
    setFilters(_filters)
  }

  const handleGenderChange = (gender: string | null) => {
    setSelectedGender(gender)
  }

  const handleCreate = () => {
    setSelectedItem(null)
    setVisible(true)
  }

  const handleEdit = (item: Customer) => {
    setSelectedItem(item)
    setVisible(true)
  }

  const handleHide = () => {
    setSelectedItem(null)
    setVisible(false)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant='h5'>ข้อมูลลูกค้า</Typography>
         
        </Box>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <GenderFilterDropdown onGenderChange={handleGenderChange} />
                <CustomerFilter value={(filters.global as any)?.value || ''} onFilterChange={onGlobalFilterChange} />
              </Box>
              <Button variant='contained'  onClick={handleCreate}>
                สร้างใหม่
              </Button>
            </Box>
            <Divider sx={{ my: 3 }} />
            <CustomerDataTable data={filteredItems} filters={filters} onEdit={handleEdit} loading={isLoading} />
          </CardContent>
        </Card>
      </Grid>

      <CustomerFormInput visible={visible} onHide={handleHide} selectedItem={selectedItem} />
    </Grid>
  )
}

export default CustomerPage