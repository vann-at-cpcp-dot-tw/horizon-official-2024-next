"use client"

const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useParams } from "next/navigation"
// import { useRouter } from 'next/navigation'
// import { useStore } from '~/store'
// import useWindowSize from '~/use/useWindowSize"

interface TypeProps {
  title: string
  date: string
  href: string
  thumbnail: string
  categories?: {
    name?: string
    href?: string
  }[]
  [key:string]: any
}

interface TypeState {}

export function formatCategories(categories:{[key:string]:any} | undefined){
  const array = categories ?Array.isArray(categories?.nodes) ?categories.nodes :categories :[]
  return array?.map((catNode:{[key:string]:any})=>{
    return {
      name: catNode?.name,
      slug: catNode.slug,
      href: `/news/${catNode.slug}`
    }
  }) || []
}

function ListItem(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const params = useParams()
  const { lang } = params

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <RatioArea className="group mb-2" ratio="56.25">
        <div className="pointer-events-none absolute left-0 top-0 z-10 flex size-full cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100"
        style={{
          background: 'rgba(0, 46, 79, 0.5)',
          transition: 'all .4s'
        }}>
          <div className="flex size-[56px] items-center justify-center rounded-full bg-golden-700">
            <i className="bi bi-plus-lg text-[24px] text-white"></i>
          </div>
        </div>
        <LinkWithLang
        className="absolute left-0 top-0 z-0 size-full overflow-hidden"
        href={props.href}
        lang={lang}>
          <Image className="pointer-events-none absolute z-0 size-full object-cover group-hover:scale-[1.2] group-active:scale-[1.2]"
          src={props?.thumbnail} fill={true} sizes="540px" alt=""
          style={{
            transition: 'all 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
          }}/>
        </LinkWithLang>
      </RatioArea>

      {
        props?.categories?.[0]?.href && <div className="text-[14px] text-gray-300 lg:text-[17px]">
          <LinkWithLang href={props?.categories?.[0]?.href} lang={lang}>
            { props.categories?.[0]?.name }
          </LinkWithLang>
        </div>
      }

      <div className="serif text-[18px] text-minor-900 lg:text-[24px]">
        <LinkWithLang href={props?.href} lang={lang}>{props?.title}</LinkWithLang>
      </div>
      <div className="text-[12px] text-gray-300 lg:text-[14px]">{ (props?.date || '').slice(0, 10).replaceAll('-', '.') }</div>
    </div>
  </Suspense>
}

export default ListItem