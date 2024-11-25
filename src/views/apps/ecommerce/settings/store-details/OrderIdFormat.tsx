// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const OrderIdFormat = () => {
  return (
    <Card>
      <CardHeader
        title='Order id format'
        subheader='Shown on the Orders page, customer pages, and customer order notifications to identify orders.'
      />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <CustomTextField
              fullWidth
              label='Prefix'
              placeholder='Prefix'
              InputProps={{
                startAdornment: <InputAdornment position='start'>#</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              fullWidth
              label='Suffix'
              placeholder='Suffix'
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>
              }}
            />
          </Grid>
        </Grid>
        <Typography className='mbs-2'>Your order ID will appear as #1001, #1002, #1003 ...</Typography>
      </CardContent>
    </Card>
  )
}

export default OrderIdFormat
