"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { QueryComingEvents } from '@src/queries/categories/coming-events.gql'
import { useQuery } from "@apollo/client"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import ComingEventDetail from "./ComingEventDetail"

// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  isSmallLayout?: boolean
  [key:string]: any
}

interface TypeState {}



function ComingEvents(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const viewport = useWindowSize()
  const router = useRouter()
  const { className } = props
  const { data } = useQuery(QueryComingEvents)
  const { nodes:list }:{nodes:{[key:string]:any}[]} = data?.comingEvents ?? {}
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const lightboxQuery = searchParams.get('comingEvent')

  const allowLightboxIDs = useMemo(()=>{
    if( !Array.isArray(list) ){
      return []
    }

    return list?.reduce<string[]>((acc, node, index)=>{
      if( isEmpty(node?.title) ){
        return acc
      }

      return [
        ...acc,
        String(index)
      ]
    }, [])

  }, [list])

  const isLightboxOpen = useMemo(()=>{
    return lightboxQuery && allowLightboxIDs.includes(lightboxQuery)
  }, [lightboxQuery, allowLightboxIDs])


  useEffect(()=>{
    if( isLightboxOpen ){
      document.body.classList.add('lb-open')
    }else{
      document.body.classList.remove('lb-open')
    }
  }, [lightboxQuery])



  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      {
        !isEmpty(list) && <div className="container serif mb-3 text-center font-300 text-minor-900 lg:mb-6">
          <div className={`mb-2 ${props?.isSmallLayout ?'text-[21px] lg:text-[28px]' :'text-[20px] lg:text-[40px]'} italic`}>- ON THE -</div>
          <div className={`-mt-3 lg:-mt-6 ${props?.isSmallLayout ?'text-[32px] lg:text-[53px]' :'text-[40px] lg:text-[80px]'}`}>CALENDER</div>
          {
            props?.isSmallLayout && <div className="-mt-1.5 text-gray-500 lg:-mt-3">Coming Events</div>
          }
        </div>
      }

      <div className="container">
        {
          list?.map((node, index:number)=>{
            return <div className={`group border-b border-gray-300 py-3 ${index === 0 ?'border-t' :''} ${!isLightboxOpen ?'btn-opacity' :''}`}
            key={index}
            onClick={()=>{
              if( isLightboxOpen ){
                return
              }
              router.push(`${pathname}?comingEvent=${index}`, {scroll:false})
            }}>
              <div className="serif mb-2 text-[21px] italic leading-[1.2] text-minor-900 lg:text-[32px]">{node?.title}</div>
              <div className="row !flex-nowrap items-end">
                <div className="col-12 shrink">
                  <div className="text-[15px] font-300 text-golden-700 lg:text-[20px]">{node?.comingEventCustomFields?.scheduleDate}</div>
                </div>
                <div className="col-auto flex">
                  <div className="btn-text border-gray-700 text-[13px] text-gray-700 lg:text-[16px]">More info</div>
                </div>
              </div>

              {
                isLightboxOpen && lightboxQuery === String(index) && <ComingEventDetail
                title={node.title}
                content={node.content}
                subtitle={node.comingEventCustomFields?.subtitle}
                scheduleDate={node.comingEventCustomFields?.scheduleDate}
                relatedHulls={node.comingEventCustomFields?.relatedHulls}
                contactTitle={node.comingEventCustomFields?.contactTitle}
                contactNumber={node.comingEventCustomFields?.contactNumber}
                contactEmail={node.comingEventCustomFields?.contactEmail}
                showInfoTable={node.comingEventCustomFields?.showInfoTable}
                />
              }
            </div>
          })
        }
      </div>
    </div>
  </Suspense>
}

export default ComingEvents