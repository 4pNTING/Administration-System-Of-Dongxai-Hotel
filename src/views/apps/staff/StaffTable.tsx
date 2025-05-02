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
import { useStaffStore } from '@core/domain/store/staffs/staff.store'
import { Staff } from '@core/domain/models/staffs/list.model'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import StaffStatusChip from '../../../views/apps/staff/StaffStatusChip'
import StaffActionButtons from '../../../views/apps/staff/StaffActionButtons'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// ปรับปรุง type definition ให้รองรับ role
type StaffWithActionsType = Staff & {
  actions?: string;
  role?: {
    id: number;
    name: string;
    description?: string;

  };
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
const columnHelper = createColumnHelper<StaffWithActionsType>()

export interface StaffDataTableProps {
  data: StaffWithActionsType[]
  loading?: boolean
  onEdit: (item: StaffWithActionsType) => void
  currentUserRole?: number
}

export const StaffDataTable = ({ data, loading = false, onEdit , currentUserRole = 0 }: StaffDataTableProps) => {
  // States
  const { delete: deleteStaff, fetchItems } = useStaffStore()
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<StaffWithActionsType[]>(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Update filtered data when data changes
  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const handleDelete = async (id: number) => {
    try {
      await deleteStaff(id);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting staff:', error)
    }
  }

  const formatStaffId = (id: number): string => {
    return `S${String(id).padStart(3, '0')}`
  }

  const formatSalary = (salary: number | null): string => {
    if (salary === null) return '0 ກີບ';
    
    const formatted = new Intl.NumberFormat('th-TH', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary)

    return `${formatted} ກີບ`
  }

  // Helper function to get role name
  const getRoleName = (staff: StaffWithActionsType): string => {
    if (staff.role && staff.role.name) {
      return staff.role.name;
    }
    
    // Fallback if role is not available
    switch (staff.roleId) {
      case 1: return 'admin';
      case 2: return 'receptionist';
      case 3: return 'staff';
      case 4: return 'manager';
      default: return 'unknown';
    }
  }

  const columns = useMemo<ColumnDef<StaffWithActionsType, any>[]>(
    () => [
      columnHelper.accessor('StaffId', {
        header: () => <div className='text-center font-medium text-base'>ລຳດັບ</div>,
        cell: ({ row }) => <Typography align='center'>{row.index + 1}</Typography>,
        enableSorting: false
      }),
      columnHelper.accessor('StaffId', {
        id: 'staffCode',
        header: () => <div className='text-center font-medium text-base'>ລະຫັດພະນັກງານ</div>,
        cell: ({ row }) => <Typography align='center'>{formatStaffId(row.original.StaffId)}</Typography>
      }),
      columnHelper.accessor('StaffName', {
        header: () => <div className='text-center font-medium text-base'>ຊື່ພະນັກງານ</div>,
        cell: ({ row }) => <Typography align='center'>{row.original.StaffName}</Typography>
      }),
      columnHelper.accessor('tel', {
        header: () => <div className='text-center font-medium text-base'>ເບີໂທລະສັບ</div>,
        cell: ({ row }) => <Typography align='center'>{row.original.tel || '-'}</Typography>
      }),
      columnHelper.accessor('userName', {
        header: () => <div className='text-center font-medium text-base'>ຊື່ຜູ້ໃຊ້</div>,
        cell: ({ row }) => <Typography align='center'>{row.original.userName}</Typography>
      }),
      columnHelper.accessor('salary', {
        header: () => <div className='text-center font-medium text-base'>ເງິນເດືອນ</div>,
        cell: ({ row }) => <Typography align='center'>{formatSalary(row.original.salary)}</Typography>
      }),
      columnHelper.accessor('gender', {
        header: () => <div className='text-center font-medium text-base'>ເພດ</div>,
        cell: ({ row }) => <StaffStatusChip gender={row.original.gender} />
      }),
      columnHelper.accessor('roleId', {
        id: 'roleName',
        header: () => <div className='text-center font-medium text-base'>ສິດການໃຊ້ງານ</div>,
        cell: ({ row }) => <Typography align='center'>{getRoleName(row.original)}</Typography>
      }),
      columnHelper.accessor('actions', {
        header: () => <div className='text-center font-medium text-base'>ຈັດການ</div>,
        cell: ({ row }) => (
          <StaffActionButtons 
            staff={row.original} 
            onEdit={onEdit} 
            onDelete={handleDelete} 
            currentUserRole={currentUserRole} 
          />
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredData,currentUserRole]
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
        pageSize: 25
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
          {loading ? (
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
                  ບໍ່ມີຂໍ້ມູນພະນັກງານ
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

export default StaffDataTable