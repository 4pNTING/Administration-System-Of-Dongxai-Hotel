import React from 'react';

// MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

// Icon Imports
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Store & Type Imports
import { useRoomStore } from '@core/domain/store/rooms/room.store';
import { Room } from '@core/domain/models/rooms/list.model';
import { nullable } from 'zod';

export interface RoomDataTableProps {
    data: Room[];
    loading?: boolean;
    onEdit: (item: Room) => void;
}

export const RoomDataTable = ({ data, loading = false, onEdit }: RoomDataTableProps) => {
    const { delete: deleteRoom } = useRoomStore();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('คุณต้องการลบข้อมูลนี้ใช่หรือไม่?')) {
            try {
                await deleteRoom(id);
                // Success message would go here
            } catch (error) {
                // Error message would go here
                console.error('Error deleting room:', error);
            }
        }
    };

    const formatRoomId = (id: number): string => {
        return `R${String(id).padStart(3, '0')}`;
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(price);
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
        switch (status) {
            case 'Available':
                return 'success';
            case 'Occupied':
                return 'warning';
            case 'Maintenance':
                return 'error';
            default:
                return 'default';
        }
    };

    // Avoid a layout jump when reaching the last page with empty rows
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    return (
        <Card>
            <CardHeader title="รายการห้องพัก" />
            <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
                <Table stickyHeader aria-label="room table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">รหัสห้อง</TableCell>
                            <TableCell align="center">ประเภทห้อง</TableCell>
                            <TableCell align="center">สถานะ</TableCell>
                            <TableCell align="right">ราคา</TableCell>
                            <TableCell align="center">วันที่สร้าง</TableCell>
                            <TableCell align="center">วันที่แก้ไข</TableCell>
                            <TableCell align="center">จัดการ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    <CircularProgress size={40} />
                                    <Box sx={{ mt: 2 }}>กำลังโหลดข้อมูล...</Box>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    ไม่พบข้อมูลห้องพัก
                                </TableCell>
                            </TableRow>
                        ) : (
                            data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((room, index) => (
                                    <TableRow key={room.RoomId} hover>
                                        <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell align="center">{formatRoomId(room.RoomId)}</TableCell>
                                        <TableCell align="center">{room.roomType?.TypeName || 'Unknown'}</TableCell>
                                        <TableCell align="center">
                                            <Chip 
                                                label={room.roomStatus?.StatusName || 'Unknown'} 
                                                color={getStatusColor(room.roomStatus?.StatusName || '')}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">{formatPrice(room.RoomPrice)}</TableCell>
                                        <TableCell align="center">{formatDate(room.createdAt ?? null)}</TableCell>
                                        <TableCell align="center">{formatDate(room.updatedAt ?? null)}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                <Tooltip title="แก้ไข">
                                                    <IconButton 
                                                        size="small" 
                                                        color="primary" 
                                                        onClick={() => onEdit(room)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="ลบ">
                                                    <IconButton 
                                                        size="small" 
                                                        color="error" 
                                                        onClick={() => handleDelete(room.RoomId)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 33 * emptyRows }}>
                                <TableCell colSpan={8} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="แถวต่อหน้า"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
            />
        </Card>
    );
};