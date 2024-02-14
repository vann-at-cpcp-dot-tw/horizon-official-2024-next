"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useState, useMemo, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { motion } from "framer-motion"
import GAGalleryNav from "../(templates)/GAGalleryNav"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

export interface TypeGAImageNode {
  title?: string
  image?: {
    node?: {
      mediaItemUrl: string
    }
  }
  imageM?: {
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
  // const viewport = useWindowSize()
  const { className } = props
  const [activeType, setActiveType] = useState(0)
  const [activeItem ,setActiveItem] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [imgPaddingBottom, setImgPaddingBottom] = useState('0')
  const images = useMemo<TypeGAImageNode[]>(()=>{
    return props?.list?.[activeType]?.images || []
  }, [props?.list, activeType])
  const imageItem = useMemo(()=>images?.[activeItem]?.image?.node?.mediaItemUrl, [images,activeItem])
  const imageItemM = useMemo(()=>images?.[activeItem]?.imageM?.node?.mediaItemUrl, [images,activeItem])


  useEffect(()=>{
    if( isOpen ){
      document.body.classList.add('lb-open')
    }else{
      document.body.classList.remove('lb-open')
    }
  }, [isOpen])

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="bg-gray-200 py-24">

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
              <div className="absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100"
                style={{
                  transition: 'all .4s'
                }}>
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-golden-700">
                  <i className="bi bi-plus-lg text-[24px] text-white"></i>
                </div>
              </div>
              <Image
              className="group-hover:brightness-50"
              src={imageItem}
              fill={true}
              sizes="90vw"
              onLoad={({ target }) => {
                const { naturalWidth, naturalHeight } = target as HTMLImageElement
                setImgPaddingBottom(`calc(100% / (${naturalWidth} / ${naturalHeight})`)
              }}
              alt="" />
            </div>
          </div>
        }

        {
          isOpen && imageItem && <div className="fixed left-0 top-0 z-[99999] flex h-full w-full flex-col justify-center bg-gray-200 p-10">

            <div className="sticky left-0 top-0 -ml-8 -mt-10 mb-8 flex pt-2">
              <div className="btn bg-golden-300"
              onClick={()=>{
                setIsOpen(false)
              }}>
                <Image src={`${BASE_PATH}/assets/img/icon_menu_x.svg`} width={48} height={48} alt=""/>
              </div>
            </div>

            <GAGalleryNav
            gaTypes={props?.list?.map((node)=>node.type)}
            itemTitles={images?.map((node)=>node?.title || '')}
            activeType={activeType}
            activeItem={activeItem}
            setActiveType={setActiveType}
            setActiveItem={setActiveItem} />


            <div className="flex grow !flex-nowrap overflow-hidden">
              <div className="h-full w-full shrink px-10">
                <div className="relative h-full w-full">
                  <Image src={imageItem} fill={true} sizes="100vw" style={{objectFit: "contain"}} alt="" />
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  </Suspense>
}

export default GAGallery