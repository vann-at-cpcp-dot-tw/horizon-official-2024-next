const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
// import { useRouter } from 'next/navigation'
// import { useStore } from '~/store'
// import useWindowSize from '~/use/useWindowSize"
import NewsListItem from "./ListItem"

interface TypeProps {
  list: {
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
  }[]
  [key:string]: any
}
interface TypeState {}

function NewsPageEventsBlock(props:TypeProps, ref:React.ReactNode){
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
              if( !node?.slug ){
                return null
              }

              return <div className="lg:col-4 col-12 mb-10" key={index}>
                <NewsListItem
                title={node.title}
                date={node.date}
                href={`/news/events/${node.slug}`}
                thumbnail={node.postCustomFields?.gallery?.[0]?.image?.node?.mediaItemUrl || ''}
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

export default NewsPageEventsBlock