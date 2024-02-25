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
import NewsListItem from "./ListItem"

interface TypeProps {
  list: {
    translation?: {
      slug: string
      title: string
      date: string
      postCustomFields: {
        gallery?: {
          image?: {
            node?: {
              mediaItemUrl: string
            }
          }
        }[]
      }
    }
  }[]
  [key:string]: any
}
interface TypeState {}

function EventSmallList(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container mb-4">
        <div className="text-[24px] font-300 text-minor-900">Events</div>
      </div>

      <div className="container">
        <div className="row">
          {
            props.list?.map?.((node, index)=>{
              if( !node?.translation?.slug ){
                return null
              }

              return <div className="lg:col-4 col-12 mb-10" key={index}>
                <NewsListItem
                title={node.translation.title}
                date={node.translation.date}
                href={`/news/events/${node.translation.slug}`}
                thumbnail={node.translation?.postCustomFields?.gallery?.[0]?.image?.node?.mediaItemUrl || ''}
                categories={[
                  {
                    name: 'Events',
                    href: '/news/events'
                  }
                ]}/>
              </div>
            })
          }
        </div>
      </div>

      <div className="container text-center">
        <LinkWithLang
        className="btn-text text-gray-700"
        href="/news/events"
        lang={props.lang}
        >More Events</LinkWithLang>
      </div>
    </div>
  </Suspense>
}

export default EventSmallList