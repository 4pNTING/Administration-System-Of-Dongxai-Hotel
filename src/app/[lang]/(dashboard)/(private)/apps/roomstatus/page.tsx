// MUI Imports
import Grid from '@mui/material/Grid'

import TableStatus from '@views/apps/roomstatus/status/TableStatus'




const roomstatus = async () => {


  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
      <TableStatus />
      </Grid>
     
    </Grid>
  )
}

export default roomstatus
