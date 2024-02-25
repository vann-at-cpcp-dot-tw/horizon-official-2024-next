const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  slug: string
  title: string
  date: string
  image: string
  lang: string
  [key:string]: any
}
interface TypeState {}

function CoverStory(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('container-fluid px-0 lg:mb-32 mb-10', className)}>

      <RatioArea ratio="42.85">
        <LinkWithLang
        className="absolute left-0 top-0 size-full"
        href={`/news/cover-story/${props.slug}`}
        lang={props.lang}>
          <Image className="object-cover" src={props?.image} fill={true} sizes="100vw" alt="" />
        </LinkWithLang>
      </RatioArea>

      <div className="relative z-10 flex justify-center">
        <div className="container">
          <div className="mt-[-32px] bg-white px-2.5 py-4 lg:mt-[-64px] lg:px-5 lg:py-8">
            <div className="text-center text-[14px] text-gray-300 lg:text-[17px]">Cover Story</div>
            <div className="serif text-center text-[28px] text-minor-900 lg:text-[43px]">
              <LinkWithLang href={`/news/cover-story/${props.slug}`} lang={props.lang}>{ props?.title }</LinkWithLang>
            </div>
            <div className="text-center text-[12px] text-gray-300 lg:text-[14px]">{ (props?.date || '').slice(0, 10).replaceAll('-', '.') }</div>
          </div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default CoverStory