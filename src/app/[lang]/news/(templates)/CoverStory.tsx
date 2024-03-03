const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import { genImageBlurHash } from "@src/lib/genImageBlurHash"
import CoverImage from "./CoverImage"
import CoverTitle from "./CoverTitle"

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

async function CoverStory(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const placeholder = await genImageBlurHash(props?.image)

  return <Suspense fallback={null}>
    <div className={twMerge('container-fluid px-0 lg:mb-32 mb-10', className)}>

      <RatioArea ratio="42.85">
        <LinkWithLang
        className="absolute left-0 top-0 size-full"
        href={`/news/cover-story/${props.slug}`}
        lang={props.lang}>
          <CoverImage
          image={props?.image}
          placeholder={placeholder} />
        </LinkWithLang>
      </RatioArea>

      <div className="relative z-10 flex justify-center">
        <div className="container">
          <CoverTitle className="mt-[-32px] lg:mt-[-64px]"
          title={props.title}
          date={props.date}
          slug={props.slug} />
        </div>
      </div>
    </div>
  </Suspense>
}

export default CoverStory