"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import SpecTable from "@src/components/custom/SpecTable"
import TermsTable from "@src/components/custom/TermsTable"
// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

interface TypeProps {
  title?: string
  activeDefault?: string | number
  specTerms?: {
    [key:string]: {
      metric: string
      imperial: string
    }
  },
  list?: {
    tableType: string
    terms: {
      termName: string
      termValue: string
    }[]
  }[]
  [key:string]: any
}
interface TypeState {}

function SpecAndFeatures(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const [active, setActive] = useState<string | number>(props?.activeDefault || 0)

  return <Suspense fallback={null}>

    <div className={twMerge('py-20', className)}
    style={{
      background: 'rgba(238, 235, 230, 1)'
    }}>

      <div className="container mb-6">
        <div className="serif text-center text-[24px] text-gray-900">{props?.title}</div>
      </div>

      <div className="container">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="row justify-center">
            {
              !isEmpty(props?.specTerms) && <div className="col-auto mb-6">
                <div className={`btn ${active === 'spec' ?'text-gray-900' :'text-gray-300'}`}
                onClick={()=>{
                  setActive('spec')
                }}>SPEC</div>
              </div>
            }

            {
              props?.list?.map((node, index)=>{
                return <div className="col-auto mb-6" key={index}>
                  <div className={`btn ${active === index ?'text-gray-900' :'text-gray-300'}`}
                  onClick={()=>{
                    setActive(index)
                  }}>{ node.tableType }</div>
                </div>
              })
            }
          </div>
        </div>
      </div>

      <div className="container">
        <div className="mx-auto w-full max-w-[900px]">
          {
            active === 'spec' && <SpecTable specTerms={props?.specTerms}/>
          }

          {
            props?.list?.map((node, index)=>{
              if( active ===  index){
                return <div key={index}>
                  <TermsTable terms={node.terms} />
                </div>
              }
            })
          }
        </div>
      </div>

    </div>

  </Suspense>
}

export default SpecAndFeatures