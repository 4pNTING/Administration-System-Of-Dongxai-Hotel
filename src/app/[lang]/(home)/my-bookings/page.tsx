import BookNowList from '@views/apps/components/customer/my-bookings/index'

import { getUserData } from '@/app/server/actions'


const mybookings = async () => {
  // Vars
  const data = await getUserData()

  return <BookNowList userData={data} />
}

export default mybookings