"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import SpecTable from "@src/components/custom/SpecTable"
// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  list: {
    specType: string
    specTerms: {
      [key:string]: {
        metric: string
        imperial: string
      }
    }
  }[]
  [key:string]: any
}
interface TypeState {}

function SpecTableSection(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const [active, setActive] = useState(0)

  return <Suspense fallback={null}>

    <div className={twMerge('lg:py-20 py-10 pb-16', className)}
    style={{
      background: 'rgba(238, 235, 230, 1)'
    }}>

      <div className="container mb-6">
        <div className="serif text-center text-[24px] text-gray-900">SPEC</div>
      </div>

      <div className="container">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="row justify-center">
            {
              props?.list?.map((node, index)=>{
                return <div className="col-auto mb-3 lg:mb-6" key={index}>
                  <div className={`btn ${active === index ?'text-gray-900' :'text-gray-300'}`}
                  onClick={()=>{
                    setActive(index)
                  }}>{ node.specType }</div>
                </div>
              })
            }
          </div>
        </div>
      </div>

      <div className="container">
        <div className="mx-auto w-full max-w-[900px]">
          {
            props?.list?.map((node, index)=>{
              if( active ===  index){
                return <div key={index}>
                  <SpecTable specTerms={node.specTerms}/>
                </div>
              }
            })
          }
        </div>
      </div>

    </div>

  </Suspense>
}

export default SpecTableSection