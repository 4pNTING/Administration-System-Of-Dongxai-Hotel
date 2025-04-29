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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
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

type StaffWithActionsType = Staff & {
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

// StaffFilter Component
interface StaffFilterProps {
  searchValue: string;
  genderFilter: string;
  roleFilter: string;
  onSearchChange: (value: string) => void;
  onGenderFilterChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
}

const StaffFilter = ({ 
  searchValue, 
  genderFilter, 
  roleFilter,
  onSearchChange, 
  onGenderFilterChange,
  onRoleFilterChange
}: StaffFilterProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <TextField
        size="small"
        value={searchValue}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="ຄົ້ນຫາ..."
        sx={{ width: { xs: '100%', sm: 200 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
      />
      
      <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
        <InputLabel id="gender-filter-label">ເພດ</InputLabel>
        <Select
          labelId="gender-filter-label"
          value={genderFilter}
          label="ເພດ"
          onChange={e => onGenderFilterChange(e.target.value)}
        >
          <MenuItem value="">ທັງໝົດ</MenuItem>
          <MenuItem value="MALE">ຊາຍ</MenuItem>
          <MenuItem value="FEMALE">ຍິງ</MenuItem>
          <MenuItem value="UNKNOWN">ອື່ນໆ</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
        <InputLabel id="role-filter-label">ສິດການໃຊ້ງານ</InputLabel>
        <Select
          labelId="role-filter-label"
          value={roleFilter}
          label="ສິດການໃຊ້ງານ"
          onChange={e => onRoleFilterChange(e.target.value)}
        >
          <MenuItem value="">ທັງໝົດ</MenuItem>
          <MenuItem value="1">ຜູ້ດູແລລະບົບ</MenuItem>
          <MenuItem value="2">ພະນັກງານຕ້ອນຮັບ</MenuItem>
          <MenuItem value="3">ພະນັກງານທົ່ວໄປ</MenuItem>
          <MenuItem value="4">ຜູ້ຈັດການ</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

// Column Definitions
const columnHelper = createColumnHelper<StaffWithActionsType>()

export interface StaffDataTableProps {
  data: Staff[]
  loading?: boolean
  onEdit: (item: Staff) => void
}

export const StaffDataTable = ({ data, loading = false, onEdit, currentUserRole = 0 }: StaffDataTableProps) => {
  // States
  const { delete: deleteStaff, fetchItems } = useStaffStore()
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  // Update filtered data when data or filters change
  useEffect(() => {
    let result = data;
    
    // Apply gender filter if selected
    if (genderFilter) {
      result = result.filter(staff => staff.gender === genderFilter);
    }
    
    // Apply role filter if selected
    if (roleFilter) {
      result = result.filter(staff => staff.roleId === parseInt(roleFilter));
    }
    
    setFilteredData(result);
  }, [data, genderFilter, roleFilter]);

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

  // Helper functions for display text
  const getRoleText = (roleId: number) => {
    switch (roleId) {
      case 1: return 'ຜູ້ດູແລລະບົບ';
      case 2: return 'ພະນັກງານຕ້ອນຮັບ';
      case 3: return 'ພະນັກງານທົ່ວໄປ';
      case 4: return 'ຜູ້ຈັດການ';
      default: return 'ບໍ່ຮູ້';
    }
  }
  
  const getPositionText = (position: string) => {
    if (!position) return '-';
    return position;
  }

  const columns = useMemo<ColumnDef<StaffWithActionsType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: () => <div className='text-center font-medium text-base'>ລຳດັບ</div>,
        cell: ({ row }) => <Typography align='center'>{row.index + 1}</Typography>,
        enableSorting: false
      }),
      columnHelper.accessor('id', {
        id: 'staffCode',
        header: () => <div className='text-center font-medium text-base'>ລະຫັດພະນັກງານ</div>,
        cell: ({ row }) => <Typography align='center'>{formatStaffId(row.original.id)}</Typography>
      }),
      columnHelper.accessor('name', {
        header: () => <div className='text-center font-medium text-base'>ຊື່ພະນັກງານ</div>,
        cell: ({ row }) => <Typography align='center'>{row.original.name}</Typography>
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
      columnHelper.accessor('position', {
        header: () => <div className='text-center font-medium text-base'>ຕຳແໜ່ງ</div>,
        cell: ({ row }) => <Typography align='center'>{getPositionText(row.original.position)}</Typography>
      }),
      columnHelper.accessor('roleId', {
        header: () => <div className='text-center font-medium text-base'>ສິດການໃຊ້ງານ</div>,
        cell: ({ row }) => <Typography align='center'>{getRoleText(row.original.roleId)}</Typography>
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
    [filteredData]
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
      <CardHeader 
        title={
          <Typography variant='h6'>ລາຍຊື່ພະນັກງານ</Typography>
        }
      />
      <Divider />
      <Box sx={{ p: 2 }}>
        <StaffFilter 
          searchValue={globalFilter ?? ''}
          genderFilter={genderFilter}
          roleFilter={roleFilter}
          onSearchChange={value => setGlobalFilter(String(value))}
          onGenderFilterChange={value => setGenderFilter(value)}
          onRoleFilterChange={value => setRoleFilter(value)}
        />
      </Box>
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