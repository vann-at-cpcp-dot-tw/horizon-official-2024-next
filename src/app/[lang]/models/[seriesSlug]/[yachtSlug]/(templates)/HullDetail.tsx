"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import Loading from "@src/components/custom/icons/Loading"
import { twMerge } from 'tailwind-merge'
import { isEmpty, convertYoutubeUrlToEmbed } from '@src/lib/helpers'
import SwiperFullHeight from "@src/components/custom/SwiperFullHeight"
import SpecTable from "@src/components/custom/SpecTable"
import GAGalleryNav from "./GAGalleryNav"
import { useRouter, usePathname } from 'next/navigation'
import { motion } from "framer-motion"
import ContentLightbox from "@src/components/custom/ContentLightbox"
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
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
    description?: string
  }[]
  specTerms: {
    [key:string]: {
      metric: string
      imperial: string
    }
  }
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
  yachtName?: string
  isComponent?: boolean
  onClose?: Function
  onUnMounted?: Function
  [key:string]: any
}
interface TypeState {}

function HullDetail(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const viewport = useWindowSize()
  const { className, background='var(--color-golden-300)' } = props
  const router = useRouter()
  const pathname = usePathname()
  const hullNav = useMemo(()=>{
    const nav = [
      {
        label: 'Exterior',
        hasContent: !isEmpty(props?.exteriorImages?.[0]?.image?.node?.mediaItemUrl)
      },
      {
        label: 'Interior',
        hasContent: !isEmpty(props?.interiorImages?.[0]?.image?.node?.mediaItemUrl)
      },
      {
        label: 'SPECS',
        hasContent: Object.values(props.specTerms).some((node)=>(node.metric || node.imperial))
      },
      {
        label: 'GA',
        hasContent: props.generalArrangementImages.some((node)=>node?.image?.node?.mediaItemUrl)
      },
      {
        label: 'VR',
        hasContent: !isEmpty(props.vrEmbedUrl)
      },
      {
        label: 'Videos',
        hasContent: props.embedVideosGallery.some((node)=>node.embedUrl)
      }
    ].filter((node)=>node.hasContent)

    return nav
  }, [
    props.exteriorImages,
    props.interiorImages,
    props.specTerms,
    props.generalArrangementImages,
    props.vrEmbedUrl,
    props.embedVideosGallery,
  ])
  const [activeSection, setActiveSection] = useState(hullNav?.[0]?.label || '')
  const [activeGAIndex, setActiveGAIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const gaItemTitles = useMemo(()=>{
    return props?.generalArrangementImages.map((node)=>node.title)
  }, [props.generalArrangementImages])

  const gaActiveItem = useMemo(()=>{
    return props.generalArrangementImages[activeGAIndex]
  }, [props.generalArrangementImages, activeGAIndex])

  useEffect(()=>{
    document.body.classList.add('lb-open')
    return ()=>{
      document.body.classList.remove('lb-open')
      props?.onUnMounted?.()
    }
  }, [props.onUnMounted])

  useEffect(()=>{
    setIsLoading(true)

    if( activeSection === 'SPEC'){
      setIsLoading(false)
    }

  }, [activeSection, activeGAIndex, gaActiveItem])

  return <ContentLightbox
  stickyHeader={
    <>
      <div className="serif mx-auto text-center text-major-900">
        <div className="text-[32px]">
          { props.yachtName ?<span>{props.yachtName}<span className="text-[30px]"> / </span></span> :''}
          { props.hullName }
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="row">
          {
            hullNav?.map((node, index)=><div className="col-auto" key={index}>
              <div className={`btn serif py-2 text-[18px] text-major-900 hover:opacity-100 ${activeSection === node.label ?'opacity-100' :'opacity-50'}`}
                    onClick={()=>{
                      setActiveSection(node.label)
                    }}>{ node?.label }</div>
            </div>)
          }
        </div>
      </div>
    </>
  }
  onClose={()=>{
    if( !props?.isComponent ){
      router.push(pathname, {scroll:false})
    }
    props?.onClose?.()
  }}>
    <div className="container-fluid relative z-0 flex grow !flex-nowrap pb-5">

      <div className="absolute left-0 top-0 z-0 flex size-full items-center justify-center">
        {
          isLoading && <Loading style={{width:'120px'}} fill="var(--color-golden-900)"/>
        }
      </div>

      {(function(){
        switch(activeSection){
          case 'Exterior':
            return <div className="relative z-10 grow overflow-hidden">
              <SwiperFullHeight
        list={props.exteriorImages?.map((node)=>{
          return {
            content: <Image src={node?.image?.node?.mediaItemUrl || ''} fill={true} sizes="100vw" alt=""
            style={{objectFit: "contain"}}
            onLoad={()=>{
              setIsLoading(false)
            }} />,
          }
        })} />
            </div>

          case 'Interior':
            return <div className="relative z-10 grow overflow-hidden">
              <SwiperFullHeight
        list={props.interiorImages?.map((node)=>{
          return {
            content: <Image src={node?.image?.node?.mediaItemUrl || ''} fill={true} sizes="100vw" alt=""
            style={{objectFit: "contain"}}
            onLoad={()=>{
              setIsLoading(false)
            }}/>,
            title: node.description
          }
        })} />
            </div>

          case 'SPECS':
            return <div className="relative z-10 flex grow flex-col bg-golden-300">
              <div className="mx-auto  w-full max-w-[900px] py-10">
                <SpecTable specTerms={props.specTerms} />
                <div className="h-[2000px]"></div>
              </div>
            </div>

          case 'GA':
            return <div className="relative z-10 flex grow flex-col">
              <GAGalleryNav
        className="py-10"
        itemTitles={gaItemTitles}
        activeItem={activeGAIndex}
        setActiveItem={setActiveGAIndex} />
              <Image className="pointer-events-none" src={gaActiveItem?.image?.node?.mediaItemUrl || ''} width={1222} height={336} sizes="100vw" alt=""
        style={{
          width: '100%',
        }}
        onLoad={()=>{
          setIsLoading(false)
        }} />
            </div>

          case 'VR':
            return <div className="relative z-10 grow">
              <iframe className="absolute left-0 top-0 z-10 size-full" src={props.vrEmbedUrl} frameBorder="0"></iframe>
            </div>

          case 'Videos':
            return <div className="relative z-10 grow">
              <SwiperFullHeight
        list={props.embedVideosGallery?.map((node)=>{
          return {
            embedUrl: convertYoutubeUrlToEmbed(node.embedUrl)
          }
        })} />
            </div>
        }
      }())}
    </div>
  </ContentLightbox>
}

export default HullDetail