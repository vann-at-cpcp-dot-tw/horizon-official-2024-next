const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import ImageAutoPlaceholder from "@root/src/components/custom/ImageAutoPlaceholder"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

import { TypeCompanyNode } from './CompaniesGrids'

interface TypeProps {
  organizationRows: {
    companies: TypeCompanyNode[]
  }[]
  [key:string]: any
}
interface TypeState {}

function CompaniesIntros(props:TypeProps, ref:React.ReactNode){
  const { className } = props

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      {
        props?.organizationRows?.map((rowNode, rowIndex)=>{
          return rowNode?.companies?.map((node, index)=>{
            return <div className="relative mb-16 lg:mb-[120px]" key={`${rowIndex}-${index}`}>
              <RatioArea className="mb-4 lg:mb-8" ratio="42.85">
                <ImageAutoPlaceholder className="absolute left-0 top-0 size-full" src={node?.images?.banner?.node?.mediaItemUrl} fill={true} sizes="100vw" />
              </RatioArea>

              <div className="container">
                <div className="mb-3 lg:mb-6">
                  <div className="text-center text-[18px] text-golden-900 lg:text-[24px]">{node?.basic?.componyName}</div>
                  {
                    node?.basic?.subtitle && <div className="mt-1 text-center text-[13px] text-gray-300 lg:text-[16px]">{node.basic.subtitle}</div>
                  }
                </div>
                {
                  node?.description && <div className="mx-auto w-full max-w-[864px] text-[15px] text-gray-700">{node.description}</div>
                }
              </div>
            </div>
          })
        })
      }
    </div>
  </Suspense>
}

export default CompaniesIntros