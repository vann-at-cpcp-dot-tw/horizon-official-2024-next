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
            <div className="btn relative"
            style={{
              paddingBottom: imgPaddingBottom,
              height: '1px',
            }}
            onClick={()=>{
              setIsOpen(true)
            }}>
              <Image
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
            <div className="flex">
              <div className="btn"
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
              <div className="h-full w-full shrink px-5">
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