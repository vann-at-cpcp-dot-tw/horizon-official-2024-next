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
    <div className={twMerge('container-fluid mb-32', className)}>
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
          <div style={{
            background: 'white',
            padding: '32px 20px',
            marginTop: '-74px'
          }}>
            <div className="text-center text-[17px] text-gray-300">Cover Story</div>
            <div className="serif text-center text-[43px] text-minor-900">
              <LinkWithLang href={`/news/cover-story/${props.slug}`} lang={props.lang}>{ props?.title }</LinkWithLang>
            </div>
            <div className="text-center text-[14px] text-gray-300">{ (props?.date || '').slice(0, 10).replaceAll('-', '.') }</div>
          </div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default CoverStory