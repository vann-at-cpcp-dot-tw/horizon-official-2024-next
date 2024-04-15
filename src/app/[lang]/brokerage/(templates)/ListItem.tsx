

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/helpers'
import RatioArea from "vanns-common-modules/dist/components/react/RatioArea"

// import { useRouter } from 'next/navigation'
// import { useStore } from '~/store'
// import useWindowSize from '~/use/useWindowSize"

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
        <RatioArea className="group mb-2 lg:mb-4" ratio="56.25">
          <div className="absolute left-0 top-0 z-10 flex size-full cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100"
        style={{
          background: 'rgba(0, 46, 79, 0.5)',
          transition: 'all .4s'
        }}>
            <div className="flex size-[56px] items-center justify-center rounded-full bg-golden-700">
              <i className="bi bi-plus-lg text-[24px] text-white"></i>
            </div>
          </div>
          <Image className="absolute left-0 top-0 size-full" src={props?.thumbnail || ''} fill={true} sizes="50vw" alt="" />
        </RatioArea>
        <div className="serif text-[18px] leading-[1.2] text-minor-900 lg:text-[24px]">{props?.title}</div>
        {
          props?.infos?.map((node, index)=><div className="text-[13px] text-gray-700 lg:text-[16px]" key={index}>{node}</div>)
        }
      </LinkWithLang>
    </div>
  </Suspense>
}

export default ListItem