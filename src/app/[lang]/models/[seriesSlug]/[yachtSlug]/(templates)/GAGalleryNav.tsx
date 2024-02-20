const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

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
    <div className={twMerge('', className)}>
      <div className="container serif mb-2 text-center text-[24px] text-gray-900">General Arrangement</div>

      <div className="container">
        <div className="row justify-center">
          {
            props?.gaTypes?.map((typeNode, typeIndex)=>{
              return <div className="col-auto" key={typeIndex}>
                <div className={`btn py-2 ${props.activeType === typeIndex ?'text-golden-900' :'text-gray-500'}`}
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
        props?.itemTitles?.length > 0 && <div className="container mb-8">
          <hr className="border-gray-300"/>
          <div className="row justify-center">
            {
              props?.itemTitles?.map((node, index)=>{
                return <div className="col-auto" key={index}>
                  <div className={`btn py-2 ${props.activeItem === index ?'text-golden-900' :'text-gray-500'}`}
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