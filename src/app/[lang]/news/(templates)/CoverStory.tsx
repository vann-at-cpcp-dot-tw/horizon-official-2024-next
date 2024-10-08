const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

import CoverImage from "./CoverImage"
import CoverTitle from "./CoverTitle"

interface TypeProps {
  slug: string
  title: string
  date: string
  image: string
  lang: string
  [key:string]: any
}
interface TypeState {}

export default async function CoverStory(props:TypeProps, ref:React.ReactNode){
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
          lang={props.lang}
          title={props.title}
          date={props.date}
          slug={props.slug} />
        </div>
      </div>
    </div>
  </Suspense>
}
