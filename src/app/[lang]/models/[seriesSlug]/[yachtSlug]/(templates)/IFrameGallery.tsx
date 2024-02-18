"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useState, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import Loading from "@src/components/custom/icons/Loading"

interface TypeProps {
  list: {
    title: string
    embedUrl: string
  }[]
  onClose: Function
  background?: string
  [key:string]: any
}
interface TypeState {}

function IFrameGallery(props:TypeProps, ref:React.ReactNode){

  const { className, background='#121212' } = props
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(()=>{
    document.body.classList.add('lb-open')
    return ()=>{
      document.body.classList.remove('lb-open')
    }
  }, [])

  return <Suspense fallback={null}>
    <div className={twMerge('relative', className)}>
      <div className="size-full fixed left-0 top-0 z-[99999] flex flex-col justify-center p-10"
      style={{
        background
      }}>

        <div className="sticky left-0 top-0 -ml-8 -mt-10 flex pt-2">
          <div className="btn mr-auto"
            onClick={()=>{
              props.onClose()
            }}>
            <Image src={`${BASE_PATH}/assets/img/icon_menu_x.svg`} width={48} height={48} alt=""
              style={{
                filter: 'grayscale(100) brightness(1000)'
              }}/>
          </div>
          <div className="mr-auto pt-6">
            <div className="row">
              {
                props?.list?.map((node, index)=>{
                  return <div className="row col-auto items-center" key={index}>
                    <div className={`btn serif py-2 text-[18px] text-white hover:opacity-100 ${activeIndex === index ?'opacity-100' :'opacity-50'}`}
                    onClick={()=>{
                      setActiveIndex(index)
                    }}>{ node?.title }</div>
                    {
                      index+1 < props?.list?.length && <div className="col-auto"><div className="text-white">．</div></div>
                    }
                  </div>
                })
              }
            </div>
          </div>
        </div>

        <div className="relative flex grow !flex-nowrap overflow-hidden">
          <div className="size-full absolute left-0 top-0 z-0 flex items-center justify-center">
            <Loading style={{width:'120px'}} />
          </div>
          <iframe className="size-full absolute left-0 top-0 z-10" src={props.list?.[activeIndex]?.embedUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
        </div>
      </div>
    </div>
  </Suspense>
}

export default IFrameGallery