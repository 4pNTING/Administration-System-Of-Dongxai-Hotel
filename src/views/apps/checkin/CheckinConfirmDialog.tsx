// src/views/apps/checkin/components/CheckinConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Booking } from '@core/domain/models/booking/list.model';

interface CheckinConfirmDialogProps {
  open: boolean;
  booking: Booking | null;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('th-TH');
};

export const CheckinConfirmDialog: React.FC<CheckinConfirmDialogProps> = ({
  open,
  booking,
  isProcessing,
  onConfirm,
  onCancel
}) => {
  if (!booking) return null;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>ຢືນຢັນການເຊັກອິນ</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການເຊັກອິນສຳລັບການຈອງນີ້?
        </DialogContentText>
        
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            <strong>ລາຍລະອຽດການຈອງ:</strong>
          </Typography>
          <Typography variant="body2">ລະຫັດການຈອງ: #{booking.BookingId}</Typography>
          <Typography variant="body2">ຫ້ອງພັກ: {booking.RoomId}</Typography>
          <Typography variant="body2">ລູກຄ້າ: {booking.customer?.CustomerName}</Typography>
          <Typography variant="body2">ວັນທີເຂົ້າພັກ: {formatDate(booking.CheckinDate)}</Typography>
          <Typography variant="body2">ວັນທີອອກຈາກຫ້ອງ: {formatDate(booking.CheckoutDate)}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isProcessing}>
          ຍົກເລີກ
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="success"
          disabled={isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} /> : <CheckCircleIcon />}
        >
          {isProcessing ? 'ກຳລັງດຳເນີນການ...' : 'ຢືນຢັນເຊັກອິນ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};