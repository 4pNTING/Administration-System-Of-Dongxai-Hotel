// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import RoomTable from '@/views/apps/roomstatus/status/RoomTable'
import RoomSearch from '@/views/apps/roomstatus/status/RoomSearch'

const rooms = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
        <RoomSearch />
      </Grid>
      <Grid item xs={12}>
        <RoomTable />
      </Grid>
    </Grid>
  )
}

export default rooms