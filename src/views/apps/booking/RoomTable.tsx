'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import {useReactTable, getCoreRowModel, getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, getPaginationRowModel, getSortedRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { Column, Table, ColumnFiltersState, FilterFn, ColumnDef } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Icon Imports
import ChevronRight from '@menu/svg/ChevronRight'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'

// Style Imports
import styles from '@core/styles/table.module.css'

// Store or Repository Import (adjust based on your project structure)
import { useRoomStore } from '@core/domain/store/rooms/room.store' // Adjust this import path
// นำเข้า toast จาก Vuexy
import { toast } from 'react-toastify'

// นำเข้าข้อความภาษาลาว
import { MESSAGES, DROPDOWN } from '../../../libs/constants/messages.constant'
// Define Room Data Type
export type RoomDataType = {
  id: number
  RoomId: number
  RoomType: string
  roomstatus: string
  roomprice: number
}

// Column Definitions
const columnHelper = createColumnHelper<RoomDataType>()

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & TextFieldProps) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const RoomTable = () => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [filterValue, setFilterValue] = useState<string>('all')
  const [data, setData] = useState<RoomDataType[]>([])
  const [loading, setLoading] = useState(true)

  // เรียกใช้งาน store
  const roomStore = useRoomStore()

  // Fetch rooms data on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        await roomStore.fetchItems()
        
        // แปลงรูปแบบข้อมูลสำหรับแสดงในตาราง
        const formattedData = roomStore.items.map(room => ({
          id: room.RoomId,
          RoomId: room.RoomId,
          RoomType: room.roomType?.TypeName || 'Unknown',
          roomstatus: room.roomStatus?.StatusName || 'Unknown',
          roomprice: room.RoomPrice
        }))
        
        setData(formattedData)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
    // ระวัง! ไม่รวม roomStore เป็น dependency เพราะจะทำให้เกิดการเรียกซ้ำ
  }, [])

  // Handlers
  const handleEdit = (id: number) => {
    console.log('Edit item with id:', id)
    // Navigate to edit page or open edit modal
    window.location.href = `/rooms/edit/${id}`
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        setLoading(true)
        await roomStore.delete(id)
        
        // แสดงข้อความสำเร็จเมื่อลบข้อมูลสำเร็จ
        toast.success(MESSAGES.SUCCESS.DELETE)
        
        // อัปเดตข้อมูลในตาราง
        setData(data.filter(room => room.id !== id))
        setLoading(false)
      } catch (error) {
        console.error('Error deleting room:', error)
        // แสดงข้อความผิดพลาดเมื่อลบข้อมูลไม่สำเร็จ
        toast.error(MESSAGES.ERROR.DELETE)
        setLoading(false)
      }
    }
  }

  const handleAddRoom = () => {
    window.location.href = '/rooms/create'
  }

  // Format RoomId to display as R001, R002, etc.
  const formatRoomId = (id: number): string => {
    return id.toString();
  }

  // Hooks
  const columns = useMemo<ColumnDef<RoomDataType, any>[]>(
    () => [
      // Sequence number column
      {
        id: 'sequence',
        header: () => (
          <div style={{ textAlign: 'center' }}>No.</div>
        ),
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>{row.index + 1}</div>
        )
      },
      columnHelper.accessor('RoomId', {
        header: () => (
          <div style={{ textAlign: 'center' }}>Room ID</div>
        ),
        cell: info => (
          <div style={{ textAlign: 'center' }}>{formatRoomId(info.getValue())}</div>
        )
      }),
      columnHelper.accessor('RoomType', {
        header: () => (
          <div style={{ textAlign: 'center' }}>Room Type</div>
        ),
        cell: info => (
          <div style={{ textAlign: 'center' }}>{info.getValue()}</div>
        )
      }),
      columnHelper.accessor('roomstatus', {
        header: () => (
          <div style={{ textAlign: 'center' }}>Status</div>
        ),
        cell: info => (
          <div style={{ textAlign: 'center' }}>{info.getValue()}</div>
        )
      }),
      columnHelper.accessor('roomprice', {
        header: () => (
          <div style={{ textAlign: 'center' }}>Price</div>
        ),
        cell: info => (
          <div style={{ textAlign: 'center' }}>{info.getValue().toLocaleString()}</div>
        )
      }),
      // Actions column for edit and delete
      {
        id: 'actions',
        header: () => (
          <div style={{ textAlign: 'center' }}>Actions</div>
        ),
        cell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Tooltip title="Edit">
                <IconButton size="small" color="primary" onClick={() => handleEdit(row.original.id)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => handleDelete(row.original.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnFilters,
      globalFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'RoomId') {
      if (table.getState().sorting[0]?.id !== 'RoomId') {
        table.setSorting([{ id: 'RoomId', desc: false }])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnFilters[0]?.id])

  // Filter data based on filterValue
  useEffect(() => {
    if (filterValue === 'all') {
      // Reset filters when "All Rooms" is selected
      table.resetColumnFilters()
    } else {
      // Apply filter for room status
      table.getColumn('roomstatus')?.setFilterValue(filterValue)
    }
  }, [filterValue, table])

  return (
    <Card>
      <CardHeader title='Room Management' />
      
      <Box sx={{ px: 6, pb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="filter-select-label">Filter</InputLabel>
            <Select
              labelId="filter-select-label"
              id="filter-select"
              value={filterValue}
              label="Filter"
              onChange={(e) => setFilterValue(e.target.value)}
              startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1 }} />}
            >
              <MenuItem value="all">All Rooms</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Occupied">Occupied</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
          
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search all columns...'
            sx={{ width: 300 }}
            size="small"
          />
        </Box>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAddRoom}
        >
          Add New Room
        </Button>
      </Box>
      
      <div className='overflow-x-auto'>
        {loading ? (
          <div className="text-center py-4">Loading rooms data...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
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
                    )
                  })}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => {
                        return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      })}
                    </tr>
                  )
                })}
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
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  )
}

export default RoomTable