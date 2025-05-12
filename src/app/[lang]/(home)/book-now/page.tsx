import BookNowList from '@views/apps/components/customer/book-now/index'

import { getUserData } from '@/app/server/actions'


const booknowListApp = async () => {
  // Vars
  const data = await getUserData()

  return <BookNowList userData={data} />
}

export default booknowListApp