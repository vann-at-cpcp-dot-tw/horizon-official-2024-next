const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

interface TypeProps {
  video: string
  image: string
  [key:string]: any
}
interface TypeState {}

function KV(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <RatioArea className="mb-12" ratio="42.85">
        <div className="absolute left-0 top-0 h-full w-full">
          {
            props?.video
              ?<video className="absolute left-0 top-0 z-0 h-full w-full object-cover" src={props?.video} playsInline muted loop autoPlay></video>
              :<Image className="absolute left-0 top-0 z-0 h-full w-full object-cover" fill={true} src={props?.image || ''} alt=""/>
          }
        </div>
      </RatioArea>
    </div>
  </Suspense>
}

export default KV