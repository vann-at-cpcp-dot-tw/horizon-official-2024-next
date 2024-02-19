const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import dynamic from "next/dynamic"
import { Suspense } from 'react'
// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
const AniCounter = dynamic(() => import('@src/components/custom/dynamic/AniCounter'), {ssr: false})

import RatioArea from "@src/components/custom/RatioArea"
import ImageAutoPlaceholder from "@root/src/components/custom/ImageAutoPlaceholder"

export interface TypeCompanyNode {
  basic:{
    componyName: string
    subtitle: string
    since: string | number
  }
  shortDescription: string
  description: string
  images: {
    grid: {
      node: {
        srcSet: string
        mediaItemUrl: string
      }
    }
    banner: {
      node: {
        srcSet: string
        mediaItemUrl: string
      }
    }
  }
  numericalData: {
    prefix: string
    number: string | number
    unit: string
  }
}

interface TypeProps {
  organizationRows: {
    companies: TypeCompanyNode[]
  }[]
  [key:string]: any
}
interface TypeState {}

function CompaniesGrids(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      {
        props?.organizationRows?.map((companiesRow, companiesRowIndex)=>{
          return <div className="row row-gap-0" key={companiesRowIndex}>
            {
              companiesRow?.companies?.map((node:TypeCompanyNode, index)=>{
                return <div className="lg:col col-12 mb-20" key={`${companiesRowIndex}-${index}`}>
                  <RatioArea className="mb-6" ratio="56.25">
                    <ImageAutoPlaceholder className="absolute left-0 top-0 size-full" src={node?.images?.grid?.node?.mediaItemUrl} fill={true} sizes="50vw" />
                  </RatioArea>

                  <div className="px-2.5">
                    <div className="mb-1 text-center text-[20px] text-golden-900">{node?.basic?.componyName}</div>
                    {
                      node?.numericalData?.number && <div className="serif text-center text-minor-900">
                        { node?.numericalData?.prefix && <span className="text-[24px]">{node?.numericalData?.prefix}&nbsp;</span> }
                        <AniCounter className="text-[36px]" from={0} to={Number(node.numericalData.number || 0)}/>
                        { node?.numericalData?.unit && <span className="text-[27px]">&nbsp;{node?.numericalData?.unit}</span> }
                      </div>
                    }
                    {
                      node?.basic?.since && <div className="serif -mt-2 mb-1 text-center text-minor-900">
                        <span className="text-[24px]">since</span><span className="text-[27px]">&nbsp;{node?.basic?.since}</span>
                      </div>
                    }
                    {
                      node?.shortDescription && <div className="text-center text-[14px] text-gray-300">{node?.shortDescription}</div>
                    }
                  </div>
                </div>
              })
            }
          </div>
        })
      }
    </div>
  </Suspense>
}

export default CompaniesGrids