// src/views/apps/checkin/CheckInCards.tsx
import Grid from '@mui/material/Grid'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Types
export type CheckInCardDataType = {
  title: string
  stats: string
  avatarIcon: string
  avatarColor?: ThemeColor
  trend: string
  trendNumber: string
  subtitle: string
}

interface CheckInCardsProps {
  totalCount: number
  pendingCount: number
  checkedInCount: number
  cancelledCount: number
}

const CheckInCards = ({ totalCount, pendingCount, checkedInCount, cancelledCount }: CheckInCardsProps) => {
  // คำนวณเปอร์เซ็นต์
  const pendingPercentage = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0
  const checkedInPercentage = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0
  const cancelledPercentage = totalCount > 0 ? Math.round((cancelledCount / totalCount) * 100) : 0
  
  const data: CheckInCardDataType[] = [
    {
      title: 'ທັງໝົດ',
      stats: totalCount.toString(),
      avatarIcon: 'tabler-calendar-event',
      avatarColor: 'primary',
      trend: 'positive',
      trendNumber: '100%',
      subtitle: 'ລາຍການທັງໝົດ'
    },
    {
      title: 'ລໍຖ້າເຊັກອິນ',
      stats: pendingCount.toString(),
      avatarIcon: 'tabler-clock-hour-2',
      avatarColor: 'warning',
      trend: 'positive',
      trendNumber: `${pendingPercentage}%`,
      subtitle: 'ພ້ອມເຊັກອິນ'
    },
    {
      title: 'ເຊັກອິນແລ້ວ',
      stats: checkedInCount.toString(),
      avatarIcon: 'tabler-check-circle',
      avatarColor: 'success',
      trend: 'positive',
      trendNumber: `${checkedInPercentage}%`,
      subtitle: 'ດຳເນີນການແລ້ວ'
    },
    {
      title: 'ຍົກເລີກ',
      stats: cancelledCount.toString(),
      avatarIcon: 'tabler-x-circle',
      avatarColor: 'error',
      trend: cancelledCount > 0 ? 'negative' : 'positive',
      trendNumber: `${cancelledPercentage}%`,
      subtitle: 'ຍົກເລີກການຈອງ'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={3}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default CheckInCards