'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Store & Type Imports
import { useRoomStore } from '@core/domain/store/rooms/room.store'
import { Room } from '@core/domain/models/rooms/list.model'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import RoomStatusChip from './RoomStatus'
import RoomActionButtons from './RoomActions'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type RoomWithActionsType = Room & {
  actions?: string
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

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
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

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper<RoomWithActionsType>()

export interface RoomDataTableProps {
  data: Room[]
  loading?: boolean
  onEdit: (item: Room) => void
  currentUserRole?: number // เพิ่มเหมือน Staff
}

export const RoomDataTable = ({ data, loading = false, onEdit, currentUserRole = 0 }: RoomDataTableProps) => {
  // States
  const { delete: deleteRoom, fetchItems, isLoading } = useRoomStore() // เพิ่ม isLoading เข้ามา
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Update filtered data when data changes
  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const handleDelete = async (id: number) => {
    try {
      await deleteRoom(id);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting room:', error)
    }
  }

  const formatRoomId = (id: number): string => {
    return `R${String(id).padStart(3, '0')}`
  }

  const formatPrice = (price: number): string => {
    const formatted = new Intl.NumberFormat('th-TH', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)

    return `${formatted} KIP`
  }

  const columns = useMemo<ColumnDef<RoomWithActionsType, any>[]>(
    () => [
      columnHelper.accessor('RoomId', {
        header: () => <div className='text-center font-medium text-base'>ລຳດັບ</div>,
        cell: ({ row }) => <Typography align='center'>{row.index + 1}</Typography>,
        enableSorting: false
      }),
      columnHelper.accessor('RoomId', {
        id: 'roomCode',
        header: () => <div className='text-center font-medium text-base'>ລະຫັດຫ້ອງ</div>,
        cell: ({ row }) => <Typography align='center'>{formatRoomId(row.original.RoomId)}</Typography>
      }),
      columnHelper.accessor(row => row.roomType?.TypeName, {
        id: 'roomTypeName',
        header: () => <div className='text-center font-medium text-base'>ປະເພດຫ້ອງ</div>,
        cell: ({ row }) => <Typography align='center'>{row.original.roomType?.TypeName || 'Unknown'}</Typography>
      }),
      columnHelper.accessor('RoomPrice', {
        header: () => <div className='text-center font-medium text-base'>ລາຄາ</div>,
        cell: ({ row }) => <Typography align='center'>{formatPrice(row.original.RoomPrice)}</Typography>
      }),
      columnHelper.accessor('roomStatus', {
        header: () => <div className='text-center font-medium text-base'>ສະຖານະ</div>,
        cell: ({ row }) => {
          const status = row.original.roomStatus;
          return <RoomStatusChip status={status} />;
        }
      }),
      columnHelper.accessor('actions', {
        header: () => <div className='text-center font-medium text-base'>ຈັດການ</div>,
        cell: ({ row }) => (
          <RoomActionButtons 
            room={row.original} 
            onEdit={onEdit} 
            onDelete={handleDelete}
            currentUserRole={currentUserRole} // ส่งสิทธิ์ผู้ใช้ไปยัง component
          />
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredData, currentUserRole]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10 // เพิ่มจำนวนแถวต่อหน้าเป็น 25 เหมือน Staff
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  // ใช้สถานะการโหลดจาก store แทน prop
  const showLoading = loading || isLoading;

  return (
    <Card>
      <Divider />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={classnames({
                            'flex items-center justify-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl ml-2' />,
                            desc: <i className='tabler-chevron-down text-xl ml-2' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {showLoading ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-10'>
                  <CircularProgress size={40} />
                  <Box sx={{ mt: 2 }}>ກຳລັງໂຫລດຂໍ້ມູນ...</Box>
                </td>
              </tr>
            </tbody>
          ) : table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-10'>
                  ບໍ່ມີຂໍ້ມູນຫ້ອງພັກ
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        component='div'
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => {
          table.setPageSize(Number(e.target.value))
        }}
        labelRowsPerPage='ແຖວຕໍ່ໜ້າ'
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ຈາກ ${count}`}
      />
    </Card>
  )
}

export default RoomDataTable