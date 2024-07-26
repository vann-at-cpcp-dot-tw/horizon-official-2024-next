const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'

// import { useRouter } from 'next/navigation'
// import { useStore } from '~/store'
// import useWindowSize from '~/use/useWindowSize"

interface TypeProps {
  title: string
  description: string
  [key:string]: any
}
interface TypeState {}

function Intro(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('lg:mb-24 mb-10', className)}>
      <div className="container">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="serif text-center text-[28px] text-golden-900 lg:mb-4 lg:text-[32px]">{props.title}</div>
          <pre className="text-center text-[15px] leading-[1.6] text-gray-700" dangerouslySetInnerHTML={{__html: props.description || ''}}></pre>
        </div>
      </div>
    </div>
  </Suspense>
}

export default Intro