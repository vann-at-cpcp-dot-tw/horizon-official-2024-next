const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useMemo } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'

// import { useRouter } from 'next/navigation'
// import { useStore } from '~/store'
// import useWindowSize from '~/use/useWindowSize"

interface TypeProps {
  itemTitles: string[]
  activeItem: number
  setActiveItem: Function
  gaTypes?: string[]
  activeType?: number
  setActiveType?: Function
  [key:string]: any
}
interface TypeState {}

function GAGalleryNav(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props

  return <Suspense fallback={null}>
    <div className={twMerge('lg:mb-8 mb-6', className)}>

      <div className="container serif mb-0 text-center text-[18px] text-gray-900 lg:mb-2 lg:text-[24px]">General Arrangement</div>

      <div className="container overflow-auto">
        <div className="row flex-nowrap">
          {
            props?.gaTypes?.map((typeNode, typeIndex)=>{
              return <div className="col-auto" key={typeIndex}
                style={{
                  marginLeft: typeIndex === 0 ?'auto' :'0',
                  marginRight: typeIndex+1 === props?.gaTypes?.length ?'auto' :'0'
                }}>
                <div className={`btn py-2 text-[14px] lg:text-[16px] ${props.activeType === typeIndex ?'text-golden-900' :'text-gray-500'}`}
                  onClick={()=>{
                    props?.setActiveType?.(typeIndex)
                    props.setActiveItem(0)
                  }}>{ typeNode }</div>
              </div>
            })
          }
        </div>
      </div>

      {
        props?.itemTitles?.length > 0 && <div className="container overflow-auto">
          <hr className="border-gray-300"/>
          <div className="row flex-nowrap">
            {
              props?.itemTitles?.map((node, index)=>{
                return <div className="col-auto" key={index}
                style={{
                  marginLeft: index === 0 ?'auto' :'0',
                  marginRight: index+1 === props?.itemTitles?.length ?'auto' :'0'
                }}>
                  <div className={`btn py-2 text-[14px] lg:text-[16px] ${props.activeItem === index ?'text-golden-900' :'text-gray-500'}`}
                    onClick={()=>{
                      props.setActiveItem(index)
                    }}>{ node }</div>
                </div>
              })
            }
          </div>
        </div>
      }
    </div>
  </Suspense>
}

export default GAGalleryNav