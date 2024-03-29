const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'


import { useRouter } from 'next/navigation'
import { useStore } from '@src/store'
import useWindowSize from "@src/hooks/useWindowSize"
import { isEmpty } from '@src/lib/helpers'

interface TypeProps {}
interface TypeState {}

function Sample(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const router = useRouter()
  const viewport = useWindowSize()

  return <Suspense fallback={null}>

  </Suspense>
}

export default Sample