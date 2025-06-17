// src/views/apps/checkin/CheckInTable.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'

import classnames from 'classnames'
import {useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'

import ChevronRight from '@menu/svg/ChevronRight'
import styles from '@core/styles/table.module.css'
import { Booking } from '@core/domain/models/booking/list.model'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-GB');
}

interface CheckInTableProps {
  data: Booking[]
  loading: boolean
  currentUserRole: number
  onCheckin: (booking: Booking) => Promise<void>
  onCancel: (booking: Booking) => Promise<void>
}

const columnHelper = createColumnHelper<Booking>()

const CheckInTable: React.FC<CheckInTableProps> = ({ 
  data, 
  loading, 
  currentUserRole,
  onCheckin,
  onCancel
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [checkinDialogOpen, setCheckinDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [localData, setLocalData] = useState<Booking[]>([])
  
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const sortedData = useMemo(() => {
    if (!localData || localData.length === 0) return [];
    const dataCopy = [...localData];
    return dataCopy.sort((a, b) => (b.BookingId || 0) - (a.BookingId || 0));
  }, [localData]);

  // *** เพิ่ม: ฟังก์ชันสำหรับแสดงสถานะ ***
  const getStatusChip = (booking: Booking) => {
    switch (booking.StatusId) {
      case 2:
        return (
          <Chip 
            label="ຢືນຢັນແລ້ວ" 
            color="success" 
            size="small"
            sx={{ 
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24
            }} 
          />
        );
      case 3:
        return (
          <Chip 
            label="ເຊັກອິນແລ້ວ" 
            color="info" 
            size="small"
            sx={{ 
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24
            }} 
          />
        );
      default:
        return (
          <Chip 
            label="ບໍ່ຮູ້ສະຖານະ" 
            color="default" 
            size="small"
            sx={{ 
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24
            }} 
          />
        );
    }
  };

  // *** เพิ่ม: ฟังก์ชันตรวจสอบว่าสามารถเช็คอินได้หรือไม่ ***
  const canCheckin = (booking: Booking): boolean => {
    return booking.StatusId === 2; // เฉพาะสถานะ "ยืนยันแล้ว" เท่านั้น
  };

  // *** เพิ่ม: ฟังก์ชันตรวจสอบว่าสามารถยกเลิกได้หรือไม่ ***
  const canCancel = (booking: Booking): boolean => {
    return booking.StatusId === 2; // เฉพาะสถานะ "ยืนยันแล้ว" เท่านั้น
  };

  // Handlers
  const handleCheckinClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCheckinDialogOpen(true);
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCheckinConfirm = async () => {
    if (!selectedBooking) return;
    
    try {
      setIsProcessing(true);
      await onCheckin(selectedBooking);
      
      // อัปเดต local data - เปลี่ยนสถานะเป็น 3 แทนการลบออก
      setLocalData(prevData => prevData.map(booking => 
        booking.BookingId === selectedBooking.BookingId
          ? { ...booking, StatusId: 3 } // เปลี่ยนเป็นสถานะ "เช็คอินแล้ว"
          : booking
      ));
      
      setCheckinDialogOpen(false);
      setSelectedBooking(null);
    } catch (error: any) {
      console.error('Error checking in:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    
    try {
      setIsProcessing(true);
      await onCancel(selectedBooking);
      
      // ลบออกจาก local data เพราะถูกยกเลิกแล้ว
      setLocalData(prevData => prevData.filter(booking => 
        booking.BookingId !== selectedBooking.BookingId
      ));
      
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    } catch (error: any) {
      console.error('Error cancelling:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDialogCancel = () => {
    setCheckinDialogOpen(false);
    setCancelDialogOpen(false);
    setSelectedBooking(null);
  };

  // Permissions
  const hasCheckinPermission = currentUserRole === 1 || currentUserRole === 2 || currentUserRole === 4;
  const hasCancelPermission = currentUserRole === 1 || currentUserRole === 4;

  const columns = useMemo<ColumnDef<Booking, any>[]>(
    () => [
      {
        id: 'sequence',
        header: () => <div style={{ textAlign: 'center' }}>ລຳດັບ</div>,
        cell: ({ row }) => <div style={{ textAlign: 'center' }}>{row.index + 1}</div>
      },
      columnHelper.accessor('BookingId', {
        header: () => <div style={{ textAlign: 'center' }}>ລະຫັດການຈອງ</div>,
        cell: info => <div style={{ textAlign: 'center' }}>{info.getValue()}</div>
      }),
      columnHelper.accessor('RoomId', {
        header: () => <div style={{ textAlign: 'center' }}>ຫ້ອງພັກ</div>,
        cell: info => {
          const roomId = info.getValue();
          const booking = info.row.original;
          const roomTypeName = booking.room?.roomType?.TypeName || '';
          const roomPrice = booking.room?.RoomPrice ? 
            booking.room.RoomPrice.toLocaleString() + ' ກີບ' : '';
          
          return (
            <div style={{ textAlign: 'center' }}>
              {roomId} 
              {roomTypeName ? ` - ${roomTypeName}` : ''} 
              {roomPrice ? ` (${roomPrice})` : ''}
            </div>
          );
        }
      }),
      columnHelper.accessor(row => row.customer?.CustomerName || 'N/A', {
        id: 'CustomerName',
        header: () => <div style={{ textAlign: 'center' }}>ລູກຄ້າ</div>,
        cell: info => <div style={{ textAlign: 'center' }}>{info.getValue()}</div>
      }),
      columnHelper.accessor('CheckinDate', {
        header: () => <div style={{ textAlign: 'center' }}>ເຂົ້າພັກ</div>,
        cell: info => <div style={{ textAlign: 'center' }}>{formatDate(info.getValue())}</div>
      }),
      columnHelper.accessor('CheckoutDate', {
        header: () => <div style={{ textAlign: 'center' }}>ອອກຈາກຫ້ອງພັກ</div>,
        cell: info => <div style={{ textAlign: 'center' }}>{formatDate(info.getValue())}</div>
      }),
      {
        id: 'status',
        header: () => <div style={{ textAlign: 'center' }}>ສະຖານະ</div>,
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            {getStatusChip(row.original)}
          </div>
        )
      },
      {
        id: 'actions',
        header: () => <div style={{ textAlign: 'center' }}>ຈັດການ</div>,
        cell: ({ row }) => {
          const booking = row.original;
          const allowCheckin = canCheckin(booking) && hasCheckinPermission;
          const allowCancel = canCancel(booking) && hasCancelPermission;
          
          return (
            <div className='flex items-center justify-center gap-2'>
              {/* ปุ่มเซ็กอิน - แสดงเฉพาะเมื่อสถานะ = 2 */}
              {booking.StatusId === 2 && (
                <Tooltip title={allowCheckin ? 'ເຊັກອິນ' : 'ບໍ່ມີສິດການເຊັກອິນ'}>
                  <span>
                    <IconButton
                      color='success'
                      onClick={() => handleCheckinClick(booking)}
                      size='small'
                      disabled={!allowCheckin}
                      sx={{ 
                        opacity: allowCheckin ? 1 : 0.3,
                        cursor: allowCheckin ? 'pointer' : 'not-allowed',
                        backgroundColor: allowCheckin ? 'success.main' : 'grey.300',
                        color: allowCheckin ? 'white' : 'grey.500',
                        '&:hover': {
                          backgroundColor: allowCheckin ? 'success.dark' : 'grey.300',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: 'grey.300',
                          color: 'grey.500'
                        }
                      }}
                    >
                      <i className='tabler-login text-lg' />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              
              {/* ปุ่มยกเลิก - แสดงเฉพาะเมื่อสถานะ = 2 */}
              {booking.StatusId === 2 && (
                <Tooltip title={allowCancel ? 'ຍົກເລີກ' : 'ບໍ່ມີສິດການຍົກເລີກ'}>
                  <span>
                    <IconButton
                      color='error'
                      onClick={() => handleCancelClick(booking)}
                      size='small'
                      disabled={!allowCancel}
                      sx={{ 
                        opacity: allowCancel ? 1 : 0.3,
                        cursor: allowCancel ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <i className='tabler-x text-lg' />
                    </IconButton>
                  </span>
                </Tooltip>
              )}

              {/* ข้อความสำหรับที่เช็คอินแล้ว */}
              {booking.StatusId === 3 && (
                <Chip 
                  label="ດຳເນີນການແລ້ວ" 
                  color="info" 
                  size="small" 
                  variant="outlined"
                />
              )}
            </div>
          );
        }
      }
    ],
    [currentUserRole, hasCheckinPermission, hasCancelPermission]
  );

  const table = useReactTable({
    data: sortedData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { columnFilters, globalFilter },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          {loading ? (
            <div className="text-center py-4">ກຳລັງໂຫລດຂໍ້ມູນ...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={classnames({
                              'flex items-center justify-center': true,
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                              desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {table.getRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      ບໍ່ພົບການຈອງທີ່ພ້ອມເຊັກອິນ
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          )}
        </div>
        <TablePagination
          component="div"
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="ຈຳນວນແຖວຕໍ່ໜ້າ:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ຈາກ ${count}`}
        />
      </Card>

      {/* Check-in Confirmation Dialog */}
      <Dialog open={checkinDialogOpen} onClose={handleDialogCancel}>
        <DialogTitle>ຢືນຢັນການເຊັກອິນ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການເຊັກອິນການຈອງນີ້?
            <br /><strong>ລະຫັດການຈອງ:</strong> {selectedBooking?.BookingId}
            <br /><strong>ລູກຄ້າ:</strong> {selectedBooking?.customer?.CustomerName}
            <br /><strong>ຫ້ອງພັກ:</strong> {selectedBooking?.RoomId}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            variant='contained' 
            endIcon={<i className='tabler-x' />}
            onClick={handleDialogCancel} 
            disabled={isProcessing}
          >
            ຍົກເລີກ
          </Button>
          <Button 
            variant='contained' 
            color='success' 
            startIcon={isProcessing ? <CircularProgress size={20} /> : <i className='tabler-login' />}
            onClick={handleCheckinConfirm} 
            disabled={isProcessing}
          >
            {isProcessing ? 'ກຳລັງເຊັກອິນ...' : 'ເຊັກອິນ'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleDialogCancel}>
        <DialogTitle>ຢືນຢັນການຍົກເລີກ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຍົກເລີກການຈອງນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
            <br /><strong>ລະຫັດການຈອງ:</strong> {selectedBooking?.BookingId}
            <br /><strong>ລູກຄ້າ:</strong> {selectedBooking?.customer?.CustomerName}
            <br /><strong>ຫ້ອງພັກ:</strong> {selectedBooking?.RoomId}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            variant='contained' 
            endIcon={<i className='tabler-arrow-back' />}
            onClick={handleDialogCancel} 
            disabled={isProcessing}
          >
            ກັບຄືນ
          </Button>
          <Button 
            variant='contained' 
            color='error' 
            startIcon={isProcessing ? <CircularProgress size={20} /> : <i className='tabler-x' />}
            onClick={handleCancelConfirm} 
            disabled={isProcessing}
          >
            {isProcessing ? 'ກຳລັງຍົກເລີກ...' : 'ຍົກເລີກການຈອງ'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CheckInTable