const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'

interface TypeProps {
  content: string
  [key:string]: any
}
interface TypeState {}

function History(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container">
        <div className="mb-8 text-center text-gray-300">History</div>
        <div className="mx-auto w-full max-w-[900px] text-gray-700">{props?.content}</div>
      </div>
    </div>
  </Suspense>
}

export default History