'use client'

import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box } from '@mui/material'

interface CustomerActionButtonsProps {
  customer: any
  onEdit: (customer: any) => void
  onDelete?: (id: number) => void
  currentUserRole?: number
}

const CustomerActionButtons = ({ customer, onEdit, onDelete, currentUserRole = 0 }: CustomerActionButtonsProps) => {
  // Note: In this example we're allowing all roles to edit/delete customers
  // If needed, you can implement role-based permissions similar to StaffActionButtons
  
  const handleDelete = () => {
    if (onDelete) {
      // Confirm before deleting
      if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນລູກຄ້ານີ້?')) {
        onDelete(customer.CustomerId)
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <IconButton 
        size="small" 
        color="primary" 
        onClick={() => onEdit(customer)}
        sx={{ mr: 1 }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      
      {onDelete && (
        <IconButton 
          size="small" 
          color="error" 
          onClick={handleDelete}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  )
}

export default CustomerActionButtons