// src/views/apps/checkin/components/CheckinCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Booking } from '@core/domain/models/booking/list.model';

interface CheckinCardProps {
  booking: Booking;
  isToday: boolean;
  onCheckin: (booking: Booking) => void;
  isProcessing?: boolean;
}

const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('th-TH');
};

export const CheckinCard: React.FC<CheckinCardProps> = ({
  booking,
  isToday,
  onCheckin,
  isProcessing = false
}) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        border: isToday ? '2px solid' : '1px solid',
        borderColor: isToday ? 'success.main' : 'divider',
        position: 'relative'
      }}
    >
      {isToday && (
        <Chip 
          label="ວັນນີ້" 
          color="success" 
          size="small"
          sx={{ 
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1
          }}
        />
      )}
      
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            ການຈອງ #{booking.BookingId}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" mb={1}>
          <RoomIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            ຫ້ອງ {booking.RoomId}
            {booking.room?.roomType?.TypeName && ` - ${booking.room.roomType.TypeName}`}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" mb={1}>
          <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            {booking.customer?.CustomerName || 'N/A'}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" mb={1}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            ເຂົ້າພັກ: {formatDate(booking.CheckinDate)}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" mb={2}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            ອອກຈາກຫ້ອງ: {formatDate(booking.CheckoutDate)}
          </Typography>
        </Box>
        
        <Chip 
          label="ຢືນຢັນແລ້ວ - ພ້ອມເຊັກອິນ" 
          color="info" 
          size="small"
          sx={{ mb: 2 }}
        />
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          startIcon={<CheckCircleIcon />}
          onClick={() => onCheckin(booking)}
          disabled={isProcessing}
        >
          ເຊັກອິນ
        </Button>
      </CardActions>
    </Card>
  );
};