const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '~/store'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import { isEmpty } from '~/lib/utils'

interface TypeProps {}
interface TypeState {}

function EventsAndNews(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const router = useRouter()
  const viewport = useWindowSize()

  return <Suspense fallback={null}>

  </Suspense>
}

export default EventsAndNews