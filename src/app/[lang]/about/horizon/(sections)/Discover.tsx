const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import T from 'vanns-common-modules/dist/components/react/T'

import { isEmpty } from '~/lib/utils'

interface TypeProps {
  content: string
  imageAfterContent: {
    mediaItemUrl?: string
    srcSet?: string
  }
  [key:string]: any
}
interface TypeState {}

function Discover(props:TypeProps){
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('lg:py-20 py-16', className)}>
      <div className="container-fluid mb-6 lg:mb-[110px]">
        <div className="mb-4 text-center text-gray-300"><T text="Discover Horizon"/></div>
        <pre className="mx-auto w-full max-w-[900px] leading-[1.6] text-gray-700"
        dangerouslySetInnerHTML={{__html: props?.content || ''}}>
        </pre>
      </div>
      <RatioArea ratio="56.25">
        <img className="absolute inset-0 size-full object-cover" src={props?.imageAfterContent?.mediaItemUrl} srcSet={props?.imageAfterContent?.srcSet} sizes="100vw" />
      </RatioArea>
    </div>
  </Suspense>
}

export default Discover