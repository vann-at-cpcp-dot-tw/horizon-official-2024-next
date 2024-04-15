"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useEffect, useMemo } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/helpers'
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import HullDetail from "../(templates)/HullDetail"

// import { useRouter } from 'next/navigation'
// import { useStore } from '~/store'
// import useWindowSize from '~/use/useWindowSize"

interface TypeProps {
  yachtName?: string
  list: {
    hullName: string
    vrEmbedUrl: string
    exteriorImages: {
      image: {
        node?: {
          mediaItemUrl: string
        }
      }
    }[]
    interiorImages: {
      image: {
        node?: {
          mediaItemUrl: string
        }
      }
    }[]
    generalArrangementImages: {
      title: string
      image: {
        node?: {
          mediaItemUrl: string
        }
      }
      imageM: {
        node?: {
          mediaItemUrl: string
        }
      }
    }[]
    embedVideosGallery: {
      embedUrl: string
    }[]
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

function Hulls(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const searchParams = useSearchParams()
  const queryHullName  = decodeURI(searchParams.get('hull') || '')
  const pathname = usePathname()
  const targetHull = useMemo(()=>{
    return props?.list?.find((node)=>node?.hullName?.toLowerCase() === queryHullName.toLowerCase())
  }, [queryHullName])

  return <Suspense fallback={null}>
    <div className={twMerge('lg:py-24 py-12', className)}>
      <div className="container mb-4">
        <div className="mb-2 text-center text-gray-300">All Customization Detail</div>
        <div className="serif text-center text-[32px] text-gray-900">View by Crafts</div>
      </div>

      <div className="container">
        <div className="mx-auto w-full max-w-[800px]">
          <div className="row xl:row-gap-15 lg:row-gap-10 justify-center">
            {
              props?.list?.map((node, index)=>{
                return <div className="col-auto" key={index}>
                  <div className="btn serif py-3 text-[40px] italic text-gray-300 hover:text-major-900"
                  onClick={()=>{
                    router.push(`${pathname}?hull=${node.hullName}`, {scroll:false})
                  }}>
                    { node?.hullName }
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </div>
    </div>

    {
      targetHull && <HullDetail yachtName={props.yachtName} {...targetHull}/>
    }
  </Suspense>
}

export default Hulls