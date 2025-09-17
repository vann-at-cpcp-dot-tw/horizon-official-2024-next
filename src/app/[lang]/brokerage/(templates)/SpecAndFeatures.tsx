"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useState } from 'react'

import { twMerge } from 'tailwind-merge'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import LinkWithLang from '~/components/custom/LinkWithLang'
import SpecTable from '~/components/custom/SpecTable'
import TermsTable from '~/components/custom/TermsTable'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  title?: string | React.ReactNode
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

function SpecAndFeatures(props:TypeProps){

  const { className } = props
  const [active, setActive] = useState<string | number>(props?.activeDefault || 0)
  const { __ } = useTranslate()

  return <Suspense fallback={null}>

    <div className={twMerge('py-20', className)}
    style={{
      background: 'rgba(238, 235, 230, 1)'
    }}>
      <div className="container mb-6">
        <div className="serif text-center text-[24px] text-gray-900">{ props?.title }</div>
      </div>

      <div className="container">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="row justify-center">
            {
              !isEmpty(props?.specTerms) && <div className="col-auto mb-3 lg:mb-6">
                <div className={`btn ${active === 'spec' ?'text-gray-900' :'text-gray-300'}`}
                onClick={()=>{
                  setActive('spec')
                }}>{ __('SPEC') }</div>
              </div>
            }

            {
              props?.list?.map((node, index)=>{
                return <div className="col-auto mb-3 lg:mb-6" key={index}>
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
            active === 'spec' && props?.specTerms && <SpecTable specTerms={props?.specTerms}/>
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