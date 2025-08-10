const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import { twMerge } from 'tailwind-merge'
import T from 'vanns-common-modules/dist/components/react/T'

import { isEmpty } from '~/lib/utils'

interface TypeProps {
  content: string
  [key:string]: any
}
interface TypeState {}

function History(props:TypeProps){
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('mb-16', className)}>
      <div className="container">
        <div className="mb-4 text-center text-gray-300"><T text="History"/></div>
        <pre className="mx-auto w-full max-w-[900px] text-gray-700" dangerouslySetInnerHTML={{__html: props?.content || ''}}></pre>
      </div>
    </div>
  </Suspense>
}

export default History