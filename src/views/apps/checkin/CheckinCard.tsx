// src/views/apps/checkin/components/CheckinCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Avatar,
} from '@mui/material';

// Vuexy Components
import CustomChip from '@core/components/mui/Chip';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Booking } from '@core/domain/models/booking/list.model';

interface CheckinCardProps {
  booking: Booking;
  isToday: boolean;
  onCheckin: (booking: Booking) => void;
  onCancel: (booking: Booking) => void; 
  isProcessing?: boolean;
}

const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const calculateStayDuration = (checkinDate: string | Date, checkoutDate: string | Date): number => {
  try {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    checkin.setHours(0, 0, 0, 0);
    checkout.setHours(0, 0, 0, 0);
    const timeDiff = checkout.getTime() - checkin.getTime();
    return Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
  } catch {
    return 1;
  }
};

export const CheckinCard: React.FC<CheckinCardProps> = ({
  booking,
  isToday,
  onCheckin,
  onCancel,
  isProcessing = false,
}) => {
  const stayDuration = calculateStayDuration(booking.CheckinDate, booking.CheckoutDate);

  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        border: isToday ? '2px solid' : undefined,
        borderColor: isToday ? 'primary.main' : undefined,
        '&:hover': {
          boxShadow: theme => theme.shadows[6]
        }
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main'
              }}
            >
              <RoomIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                #{booking.BookingId}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
            {isToday && (
              <CustomChip
                label="ວັນນີ້"
                size="small"
                variant="tonal"
                color="success"
                sx={{ fontWeight: 600 }}
              />
            )}
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
              ຫ້ອງ {booking.RoomId}
            </Typography>
            {booking.room?.roomType?.TypeName && (
              <CustomChip
                label={booking.room.roomType.TypeName}
                size="small"
                variant="tonal"
                color="secondary"
              />
            )}
          </Box>
        </Box>

        {/* Customer Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1.5 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {booking.customer?.CustomerName || 'ບໍ່ມີຊື່'}
          </Typography>
        </Box>

        {/* Dates */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: 'success.main', mr: 1.5 }} />
            <Typography variant="body2" color="text.secondary">
              ເຂົ້າພັກ: <strong>{formatDate(booking.CheckinDate)}</strong>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: 'error.main', mr: 1.5 }} />
            <Typography variant="body2" color="text.secondary">
              ອອກຈາກຫ້ອງ: <strong>{formatDate(booking.CheckoutDate)}</strong>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: 'info.main', mr: 1.5 }} />
            <Typography variant="body2" color="text.secondary">
              ໄລຍະພັກ: <strong>{stayDuration} ວັນ</strong>
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Box sx={{ display: 'flex',  width: '100%' }}>
           <Button
            variant="tonal"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => onCancel(booking)}
            disabled={isProcessing}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              py: 1.5,
              flex: 1
            }}
          >
            ຍົກເລີກ
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={() => onCheckin(booking)}
            disabled={isProcessing}
            sx={{
              fontWeight: 600,
              py: 1.5,
              textTransform: 'none',
              flex: 1
            }}
          >
            ເຊັກອິນ
          </Button>

         
        </Box>
      </CardActions>
    </Card>
  );
};