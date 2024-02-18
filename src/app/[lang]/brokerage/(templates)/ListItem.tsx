

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@root/src/components/custom/RatioArea"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

interface TypeProps {
  slug: string
  title: string
  thumbnail: string
  href: string
  lang: string | string[]
  infos?: string[]
  [key:string]: any
}
interface TypeState {}

function ListItem(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props

  return <Suspense fallback={null}>
    <div className={twMerge('relative', className)}>
      <LinkWithLang lang={props.lang} href={props.href}>
        <RatioArea className="group mb-4" ratio="56.25">
          <div className="size-full absolute left-0 top-0 z-10 flex cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100"
        style={{
          background: 'rgba(0, 46, 79, 0.5)',
          transition: 'all .4s'
        }}>
            <div className="flex size-[56px] items-center justify-center rounded-full bg-golden-700">
              <i className="bi bi-plus-lg text-[24px] text-white"></i>
            </div>
          </div>
          <Image className="size-full absolute left-0 top-0" src={props?.thumbnail || ''} fill={true} sizes="50vw" alt="" />
        </RatioArea>
        <div className="serif text-[24px] text-minor-900">{props?.title}</div>
        {
          props?.infos?.map((node, index)=><div className="text-gray-700" key={index}>{node}</div>)
        }
      </LinkWithLang>
    </div>
  </Suspense>
}

export default ListItem