"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useState, useEffect, useMemo } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

import { motion } from "framer-motion"
import ContentLightbox from "@src/components/custom/ContentLightbox"

interface TypeProps {
  list: {
    basic: {
      title: string
      description: string
      keyImage: {
        node?: {
          mediaItemUrl: string
        }
        placeholder?: string
      }
    }
    content: string
    designPartnersTitle?: string
    designPartners?: {
      title: string
      subtitle: string
      description: string
      image?: {
        node: {
          mediaItemUrl: string
        }
        placeholder?: string
      }
    }[]
  }[]
  [key:string]: any
}
interface TypeState {}

function ContentList(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const viewport = useWindowSize()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const lightboxQuery = searchParams.get('open')
  const { className } = props

  const allowLightboxIDs = useMemo(()=>{
    if( !Array.isArray(props.list) ){
      return []
    }

    return props?.list?.reduce<string[]>((acc, node, index)=>{
      if( isEmpty(node?.content) ){
        return acc
      }

      return [
        ...acc,
        String(index)
      ]
    }, [])

  }, [props?.list])


  const isLightboxOpen = useMemo(()=>{
    return lightboxQuery && allowLightboxIDs.includes(lightboxQuery)
  }, [lightboxQuery, allowLightboxIDs])


  useEffect(()=>{
    if( isLightboxOpen ){
      document.body.classList.add('lb-open')
    }else{
      document.body.classList.remove('lb-open')
    }
  }, [lightboxQuery])


  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      {
        props?.list?.map((node, index)=>{
          return <div className="container mb-14 lg:mb-20" key={index}>
            <div className="mx-auto w-full max-w-[900px]">
              <RatioArea className="group mb-3 overflow-hidden lg:mb-5" ratio="56.25">
                {
                  node?.content && <div className="absolute left-0 top-0 z-10 flex size-full cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100"
                  onClick={()=>{
                    router.push(`${pathname}?open=${index}`, {scroll:false})
                  }}
                  style={{
                    background: 'rgba(0, 46, 79, 0.5)',
                    transition: 'all .4s'
                  }}>
                    <div className="flex size-[56px] items-center justify-center rounded-full bg-golden-700">
                      <i className="bi bi-plus-lg text-[24px] text-white"></i>
                    </div>
                  </div>
                }
                <Image className={`pointer-events-none absolute left-1/2 top-1/2 z-0 size-full -translate-x-1/2 -translate-y-1/2 object-cover ${ node?.content ?'group-hover:scale-[1.2] group-active:scale-[1.2]' :''}`}
                src={node?.basic?.keyImage?.node?.mediaItemUrl || ''}
                width={900}
                height={506}
                priority={true}
                placeholder={node?.basic?.keyImage?.placeholder ?'blur' :'empty'}
                blurDataURL={node?.basic?.keyImage?.placeholder}
                alt=""
                style={{
                  transition: 'all 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
                }} />
              </RatioArea>
              <div className="serif mb-1 text-center text-[24px] text-minor-900 lg:mb-2 lg:text-[32px]">{node?.basic?.title}</div>
              <div className="mb-3 text-gray-700 lg:mb-5">{node?.basic?.description}</div>
              {
                node?.content && <div className="flex justify-center">
                  <div className="cursor-pointer text-gray-300 underline"
                  onClick={()=>{
                    router.push(`${pathname}?open=${index}`, {scroll:false})
                  }}>Read more</div>
                </div>
              }
            </div>

            {
              isLightboxOpen && lightboxQuery === String(index) && node?.content && <ContentLightbox
              background="#f3f0ea"
              onClose={()=>{
                router.push(`${pathname}`, {scroll:false})
              }}>
                <div className="pt-6 lg:pt-12">
                  <div className="MCE-CONTENT mb-6">
                    <div className="container">
                      <div className="mx-auto w-full max-w-[900px]" dangerouslySetInnerHTML={{__html:node?.content}}></div>
                    </div>
                  </div>

                  <div className="container pt-10 lg:pt-20"
                  style={{
                    maxWidth: '1240px',
                  }}>
                    {
                      node?.designPartnersTitle && <div className="mb-6 text-center text-golden-900 lg:mb-8">{node?.designPartnersTitle}</div>
                    }

                    <div className="row xl:row-gap-8 justify-center">
                      {
                        node?.designPartners?.map((designerNode, designerIndex)=>{
                          return <div className="lg:col-3 col-6 mb-5" key={designerIndex}>
                            <RatioArea className="mb-3" ratio="114.28">
                              <Image className="absolute left-0 top-0 size-full"
                              src={designerNode?.image?.node?.mediaItemUrl || ''}
                              fill={true}
                              sizes="25vw"
                              placeholder={designerNode?.image?.placeholder ?'blur' :'empty'}
                              blurDataURL={designerNode?.image?.placeholder}
                              alt="" />
                            </RatioArea>
                            <div className="mb-2 text-[24px] text-gray-900">{designerNode?.title}</div>

                            {
                              designerNode?.subtitle && <div className="mb-3 border-y border-gray-700 py-1 text-gray-500">{designerNode?.subtitle}</div>
                            }

                            <div className="text-[15px] text-gray-900">{designerNode?.description}</div>
                          </div>
                        })
                      }
                    </div>
                  </div>

                  <div className="flex justify-center py-20">
                    <div className="btn border-b-[3px] border-b-gray-500 pb-0.5 text-[15px] text-gray-500"
                    onClick={()=>{
                      router.push(`${pathname}`, {scroll:false})
                    }}>Close</div>
                  </div>
                </div>
              </ContentLightbox>
            }
          </div>
        })
      }
    </div>
  </Suspense>
}

export default ContentList