const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'

interface TypeProps {
  src: string
  [key:string]: any
}
interface TypeState {}

function FeaturedVideo(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('lg:mb-24 mb-12', className)}>
      <RatioArea ratio="42.85">
        <video className="absolute left-0 top-0 z-0 size-full object-cover" autoPlay playsInline muted loop
        src={props.src}></video>
      </RatioArea>
    </div>
  </Suspense>
}

export default FeaturedVideo