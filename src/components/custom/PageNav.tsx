const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'
import Loading from "./icons/Loading"

// import { useRouter } from 'next/navigation'
// import { useStore } from '~/store'
// import useWindowSize from '~/use/useWindowSize"

interface TypeProps {
  pageInfo?: {
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  isLoading?: boolean
  loadingColor?: string
  moreMode?: boolean
  moreText?: string
  onNextClick?: Function
  onPrevClick?: Function
  [key:string]: any
}
interface TypeState {}

function PageNav(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const { hasNextPage, hasPreviousPage  } = props?.pageInfo || {}

  if (!hasPreviousPage && !hasNextPage){
    return null
  }

  return <Suspense fallback={null}>
    <div className={twMerge('container', className)}>
      {
        props?.isLoading
          ? <div className="row justify-center">
            <div className="col-auto">
              <div style={{width:'32px'}}>
                <Loading fill={props?.loadingColor || 'var(--color-golden-900)'}/>
              </div>
            </div>
          </div>
          :<div className="row justify-center">
            {
              props?.moreMode
                ? <>
                  {
                    hasNextPage && <div className="col-auto">
                      <div className={`text-gray-700 ${hasNextPage ?'btn-text' :'pointer-events-none'}`}
                    onClick={()=>{
                      props?.onNextClick?.()
                    }}>{props?.moreText || 'More'}</div>
                    </div>
                  }
                </>
                : <>
                  <div className="col-auto">
                    <div className={`text-gray-700 ${hasPreviousPage ?'btn-text' :'pointer-events-none'}`}
                    onClick={()=>{
                      props?.onPrevClick?.()
                    }}>Prev</div>
                  </div>
                  <div className="col-auto text-gray-700">|</div>
                  <div className="col-auto">
                    <div className={`text-gray-700 ${hasNextPage ?'btn-text' :'pointer-events-none'}`}
                    onClick={()=>{
                      props?.onNextClick?.()
                    }}>Next</div>
                  </div>
                </>
            }

          </div>
      }

    </div>
  </Suspense>
}

export default PageNav