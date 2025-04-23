// src/app/components/room/RoomSearch.tsx
'use client';

import { useState } from 'react';
import { useRoomStore } from '@core/domain/store/rooms/room.store';
import { Room } from '@core/domain/models/rooms/list.model';
import { format } from 'date-fns';

// Import ตามโครงสร้างจริงของโปรเจค
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

export default function RoomSearch() {
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  
  const { 
    availableRooms, 
    isSearching, 
    getAvailableRooms 
  } = useRoomStore();

  const handleSearch = async () => {
    if (!checkInDate || !checkOutDate) {
      // แสดง error ว่าต้องเลือกวันที่ทั้งสองช่อง
      return;
    }

    try {
      await getAvailableRooms(checkInDate, checkOutDate);
    } catch (error) {
      console.error('Failed to search for available rooms:', error);
    }
  };

  // ตรวจสอบว่าวันเช็คเอาท์ต้องมากกว่าวันเช็คอิน
  const isCheckOutValid = (): boolean => {
    if (!checkInDate || !checkOutDate) return true;
    return new Date(checkOutDate) > new Date(checkInDate);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        ค้นหาห้องพักที่ว่าง
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardHeader title="เลือกวันที่เข้าพักและออก" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                วันที่เช็คอิน
              </Typography>
              <TextField
                type="date"
                fullWidth
                variant="outlined"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: format(new Date(), 'yyyy-MM-dd')
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                วันที่เช็คเอาท์
              </Typography>
              <TextField
                type="date"
                fullWidth
                variant="outlined"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                error={checkOutDate !== '' && !isCheckOutValid()}
                helperText={checkOutDate !== '' && !isCheckOutValid() ? 'วันที่เช็คเอาท์ต้องมากกว่าวันที่เช็คอิน' : ''}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: checkInDate || format(new Date(), 'yyyy-MM-dd')
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSearch}
            disabled={isSearching || !checkInDate || !checkOutDate || !isCheckOutValid()}
            fullWidth
          >
            {isSearching ? 'กำลังค้นหา...' : 'ค้นหาห้องว่าง'}
          </Button>
        </CardActions>
      </Card>

      {availableRooms.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            ห้องพักที่ว่าง
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {availableRooms.map((room: Room) => (
              <Grid item xs={12} md={6} lg={4} key={room.RoomId}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardHeader title={room.roomType?.TypeName || 'ห้องพัก'} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" paragraph>
                      <b>หมายเลขห้อง:</b> {room.RoomId}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <b>ราคา:</b> {room.RoomPrice.toLocaleString()} บาท/คืน
                    </Typography>
                    <Typography variant="body1">
                      <b>สถานะ:</b> {room.roomStatus?.StatusName || 'ว่าง'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button variant="contained" color="primary" fullWidth>
                      จองเลย
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {availableRooms.length === 0 && !isSearching && (checkInDate && checkOutDate) && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            ไม่พบห้องว่างในช่วงเวลาที่เลือก
          </Typography>
          <Typography variant="body1">
            กรุณาเลือกวันที่อื่น หรือติดต่อเจ้าหน้าที่สำหรับข้อมูลเพิ่มเติม
          </Typography>
        </Alert>
      )}
    </Box>
  );
}