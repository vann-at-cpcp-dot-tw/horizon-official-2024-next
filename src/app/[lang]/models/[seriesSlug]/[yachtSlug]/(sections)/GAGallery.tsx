"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useState, useMemo, useEffect } from 'react'

import { motion } from "framer-motion"
import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'

import ContentLightbox from '~/components/custom/ContentLightbox'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

import GAGalleryNav from "../(templates)/GAGalleryNav"

export interface TypeGAImageNode {
  title?: string
  image?: {
    node?: {
      mediaItemUrl: string
    }
  }
}
interface TypeProps {
  list: {
    type: string
    images: TypeGAImageNode[]
  }[]
  [key:string]: any
}
interface TypeState {}

function GAGallery(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  const viewport = useWindowSize()
  const { className } = props
  const [activeType, setActiveType] = useState(0)
  const [activeItem ,setActiveItem] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLightboxLoading, setIsLightboxLoading] = useState(false)
  const [imgPaddingBottom, setImgPaddingBottom] = useState('0')
  const images = useMemo<TypeGAImageNode[]>(()=>{
    return props?.list?.[activeType]?.images || []
  }, [props?.list, activeType])
  const imageItem = useMemo(()=>images?.[activeItem]?.image?.node?.mediaItemUrl, [images,activeItem])

  useEffect(()=>{
    if( isOpen ){
      document.body.classList.add('lb-open')
    }else{
      document.body.classList.remove('lb-open')
    }
  }, [isOpen])

  useEffect(()=>{
    setIsLoading(true)
    setIsLightboxLoading(true)
  }, [activeType, activeItem])

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="bg-gray-200 py-12 pb-16 lg:py-24">

        <GAGalleryNav
        gaTypes={props?.list?.map((node)=>node.type)}
        itemTitles={images?.map((node)=>node?.title || '')}
        activeType={activeType}
        activeItem={activeItem}
        setActiveType={setActiveType}
        setActiveItem={setActiveItem} />

        {
          !isOpen && imageItem && <div className="container">
            <div className="btn group relative"
            style={{
              paddingBottom: imgPaddingBottom,
              height: '1px',
            }}
            onClick={()=>{
              setIsOpen(true)
            }}>
              <div className="absolute left-0 top-0 z-10 flex size-full cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100"
                style={{
                  transition: 'all .4s'
                }}>
                <div className="flex size-[56px] items-center justify-center rounded-full bg-golden-700">
                  <i className="bi bi-plus-lg text-[24px] text-white"></i>
                </div>
              </div>
              <Image
              className={`group-hover:brightness-50 ${isLoading ?'opacity-0' :'opacity-1'}`}
              src={imageItem}
              fill={true}
              sizes="90vw"
              style={{
                transition: 'all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
              }}
              onLoad={({ target }) => {
                const { naturalWidth, naturalHeight } = target as HTMLImageElement
                setImgPaddingBottom(`calc(100% / (${naturalWidth} / ${naturalHeight})`)
                setIsLoading(false)
              }}
              alt="" />
            </div>
          </div>
        }

        {
          isOpen && imageItem && <ContentLightbox
          background="#EFEFF0"
          onClose={()=>{
            setIsOpen(false)
          }}>
            <>
              <GAGalleryNav
              gaTypes={props?.list?.map((node)=>node.type)}
              itemTitles={images?.map((node)=>node?.title || '')}
              activeType={activeType}
              activeItem={activeItem}
              setActiveType={setActiveType}
              setActiveItem={setActiveItem} />

              <div className="flex grow !flex-nowrap overflow-hidden">
                <div className="size-full shrink px-5 pb-5 lg:px-10 lg:pb-10">
                  <div className="relative size-full">
                    <Image className={`${isLightboxLoading ?'opacity-0' :'opacity-1'}`} src={imageItem} fill={true} sizes="100vw"
                    style={{
                      objectFit: "contain",
                      objectPosition: "top",
                      transition: 'all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
                    }}
                    alt=""
                    onLoad={()=>{
                      setIsLightboxLoading(false)
                    }} />
                  </div>
                </div>
              </div>
            </>
          </ContentLightbox>
        }
      </div>
    </div>
  </Suspense>
}

export default GAGallery