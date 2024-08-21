const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import Image from "next/image"
import dynamic from "next/dynamic"
import { Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'
import T from 'vanns-common-modules/dist/components/react/T'
const AniCounter = dynamic(() => import('~/components/custom/dynamic/AniCounter'), {ssr: false})

import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import ImageAutoPlaceholder from "~/components/custom/ImageAutoPlaceholder"

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
                return <div className="lg:col col-12 mb-10 lg:mb-20" key={`${companiesRowIndex}-${index}`}>
                  <RatioArea className="mb-3 lg:mb-6" ratio="56.25">
                    <ImageAutoPlaceholder className="absolute left-0 top-0 size-full" src={node?.images?.grid?.node?.mediaItemUrl} fill={true} sizes="50vw" />
                  </RatioArea>

                  <div className="px-2.5">
                    <div className="text-center text-[16px] text-golden-900 lg:mb-1 lg:text-[20px]">{node?.basic?.componyName}</div>
                    {
                      node?.numericalData?.number && <div className="serif text-center text-minor-900">
                        { node?.numericalData?.prefix && <span className="text-[17px] lg:text-[24px]">{node?.numericalData?.prefix}&nbsp;</span> }
                        <AniCounter className="text-[28px] lg:text-[36px]" from={0} to={Number(node.numericalData.number || 0)}/>
                        { node?.numericalData?.unit && <span className="text-[18px] lg:text-[27px]">&nbsp;{node?.numericalData?.unit}</span> }
                      </div>
                    }
                    {
                      node?.basic?.since && <div className="serif -mt-1 mb-1 text-center text-minor-900 lg:-mt-2">
                        <span className="text-[17px] lg:text-[24px]"><T text="since"/></span><span className="text-[18px] lg:text-[27px]">&nbsp;{node?.basic?.since}</span>
                      </div>
                    }
                    {
                      node?.shortDescription && <div className="text-center text-[12px] text-gray-300 lg:text-[14px]">{node?.shortDescription}</div>
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