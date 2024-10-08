"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useEffect, useMemo, useState } from 'react'

import Image from "next/image"
import { useRouter, usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import ContentLightbox from '~/components/custom/ContentLightbox'
import Loading from '~/components/custom/icons/Loading'
import LinkWithLang from '~/components/custom/LinkWithLang'
import SpecTable from '~/components/custom/SpecTable'
import SwiperFullHeight from '~/components/custom/SwiperFullHeight'
import { isEmpty, convertYoutubeUrlToEmbed } from '~/lib/utils'

import GAGalleryNav from "./GAGalleryNav"

interface TypeProps {
  hullName: string
  yachtName?: string
  vrEmbedUrl?: string
  exteriorImages?: {
    image: {
      node?: {
        mediaItemUrl: string
      }
    }
  }[]
  interiorImages?: {
    image: {
      node?: {
        mediaItemUrl: string
      }
    }
    description?: string
  }[]
  specTerms?: {
    [key:string]: {
      metric: string
      imperial: string
    }
  }
  generalArrangementImages?: {
    title: string
    image: {
      node?: {
        mediaItemUrl: string
      }
    }
  }[]
  embedVideosGallery?: {
    embedUrl: string
  }[]
  asComponent?: boolean
  onClose?: Function
  onUnMounted?: Function
  [key:string]: any
}
interface TypeState {}

function HullDetail(props:TypeProps, ref:React.ReactNode){
  const viewport = useWindowSize()
  const { className, background='var(--color-golden-300)' } = props
  const router = useRouter()
  const pathname = usePathname()
  const { __ } = useTranslate()
  const hullNav = useMemo(()=>{
    const nav = [
      {
        label: __('Exterior') as string,
        hasContent: !isEmpty(props?.exteriorImages?.[0]?.image?.node?.mediaItemUrl)
      },
      {
        label: __('Interior') as string,
        hasContent: !isEmpty(props?.interiorImages?.[0]?.image?.node?.mediaItemUrl)
      },
      {
        label: __('SPECS') as string,
        hasContent: Object?.values?.(props?.specTerms || {})?.some?.((node)=>(node.metric || node.imperial))
      },
      {
        label: __('GA') as string,
        hasContent: props?.generalArrangementImages?.some?.((node)=>node?.image?.node?.mediaItemUrl)
      },
      {
        label: __('VR') as string,
        hasContent: !isEmpty(props?.vrEmbedUrl)
      },
      {
        label: __('Videos') as string,
        hasContent: props?.embedVideosGallery?.some?.((node)=>node.embedUrl)
      }
    ].filter((node)=>node.hasContent)
    return nav
  }, [
    props?.exteriorImages,
    props?.interiorImages,
    props?.specTerms,
    props?.generalArrangementImages,
    props?.vrEmbedUrl,
    props?.embedVideosGallery,
    __
  ])

  const [activeSection, setActiveSection] = useState('')
  const [activeGAIndex, setActiveGAIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isGALoading, setIsGALoading] = useState(false)

  const gaItemTitles = useMemo(()=>{
    return props?.generalArrangementImages?.map?.((node)=>node.title)
  }, [props.generalArrangementImages])

  const gaActiveItem = useMemo(()=>{
    return props.generalArrangementImages?.[activeGAIndex]
  }, [props.generalArrangementImages, activeGAIndex])

  useEffect(()=>{
    if( isEmpty(hullNav?.[0]?.label) || activeSection ){
      return
    }
    setActiveSection(hullNav[0].label)
  }, [hullNav, activeSection])

  useEffect(()=>{
    document.body.classList.add('lb-open')
    return ()=>{
      document.body.classList.remove('lb-open')
      props?.onUnMounted?.()
    }
  }, [props?.onUnMounted])


  useEffect(()=>{
    setIsLoading(true)

    if(
      activeSection === 'SPEC'
      || activeSection === 'Videos'
    ){
      setIsLoading(false)
    }

  }, [activeSection])

  useEffect(()=>{
    setIsGALoading(true)
  }, [activeGAIndex, gaActiveItem])
  return <ContentLightbox
  stickyHeader={
    <>
      <div className="serif mx-auto text-center text-major-900">
        <div className="text-[21px] leading-[1.2] lg:text-[32px]">
          { props.yachtName ?<span>{props.yachtName}<span className="text-[30px]"> / </span></span> :''}
          { props.hullName }
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="row">
          {
            hullNav?.map((node, index)=><div className="col-auto" key={index}>
              <div className={`btn serif py-2 text-[14px] leading-[1.2] text-major-900 hover:opacity-100 lg:text-[18px] ${activeSection === node.label ?'opacity-100' :'opacity-50'}`}
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
    if( !props?.asComponent ){
      router.push(pathname, {scroll:false})
    }
    props?.onClose?.()
  }}>
    <div className="relative z-0 flex grow flex-col !flex-nowrap">

      <div className="absolute left-0 top-0 z-0 flex size-full items-center justify-center">
        {
          isLoading && <Loading style={{width:'120px'}} fill="var(--color-golden-900)"/>
        }
      </div>

      {(function(){
        switch(activeSection){
          case 'Exterior':
            return <div className={`relative z-10 grow overflow-hidden ${isLoading ?'opacity-0' :'opacity-100'}`}
            style={{
              transition: 'all 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
            }}>
              {
                props?.exteriorImages && <SwiperFullHeight
                list={props.exteriorImages.map((node)=>{
                  return {
                    content: <Image src={node?.image?.node?.mediaItemUrl || ''}
                    fill={viewport.width && viewport.width >= 992 ?true :false}
                    width={viewport.width && viewport.width >= 992 ?0 :1920}
                    height={viewport.width && viewport.width >= 992 ?0 :1080}
                    sizes="100vw"
                    style={{
                      objectFit: viewport.width && viewport.width >= 992 ?'contain' :'cover',
                      width: '100%',
                      height: viewport.width && viewport.width >= 992 ?'100%' :'auto'
                    }}
                    alt=""
                    onLoad={()=>{
                      setIsLoading(false)
                    }} />,
                  }
                })} />
              }
            </div>

          case 'Interior':
            return <div className={`relative z-10 grow overflow-hidden ${isLoading ?'opacity-0' :'opacity-100'}`}
            style={{
              transition: 'all 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
            }}>
              {
                props?.interiorImages && <SwiperFullHeight
                list={props.interiorImages.map((node)=>{
                  return {
                    content: <Image src={node?.image?.node?.mediaItemUrl || ''}
                    fill={viewport.width && viewport.width >= 992 ?true :false}
                    width={viewport.width && viewport.width >= 992 ?0 :1920}
                    height={viewport.width && viewport.width >= 992 ?0 :1080}
                    sizes="100vw"
                    style={{
                      objectFit: viewport.width && viewport.width >= 992 ?'contain' :'cover',
                      width: '100%',
                      height: viewport.width && viewport.width >= 992 ?'100%' :'auto'
                    }}
                    alt=""
                    onLoad={()=>{
                      setIsLoading(false)
                    }}/>,
                    title: node.description
                  }
                })} />
              }
            </div>

          case 'SPECS':
            return <div className="container-fluid relative z-10 flex grow flex-col bg-golden-300 pb-5">
              <div className="mx-auto  w-full max-w-[900px] py-10">
                <SpecTable specTerms={props.specTerms} />
              </div>
            </div>

          case 'GA':
            return <div className={`container-fluid relative z-10 flex grow flex-col pb-5 ${isLoading ?'opacity-0' :'opacity-100'}`}
            style={{
              transition: 'all 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
            }}>
              {
                gaItemTitles && <GAGalleryNav
                className="mt-2"
                itemTitles={gaItemTitles}
                activeItem={activeGAIndex}
                setActiveItem={setActiveGAIndex} />
              }

              <div className="relative grow">
                <Image className={`pointer-events-none ${isGALoading ?'opacity-0' :'opacity-1'}`}
                  src={gaActiveItem?.image?.node?.mediaItemUrl || ''}
                  fill={true}
                  sizes="100vw"
                  style={{
                    objectFit: "contain",
                    objectPosition: "top",
                    transition: 'all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
                  }}
                  alt=""
                  onLoad={()=>{
                    setIsLoading(false)
                    setIsGALoading(false)
                  }} />
              </div>
            </div>

          case 'VR':
            return <div className="relative z-10 grow">
              <iframe className="absolute left-0 top-0 z-10 size-full" src={props.vrEmbedUrl} frameBorder="0"></iframe>
            </div>

          case 'Videos':
            return <div className="relative z-10 grow">
              {
                props?.embedVideosGallery && <SwiperFullHeight
                iframeRatio={1.78}
                list={props.embedVideosGallery.map((node)=>{
                  return {
                    content: <RatioArea ratio="56.25">
                      <iframe className="absolute left-0 top-0 z-10 size-full"
                      src={convertYoutubeUrlToEmbed(node.embedUrl)} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                    </RatioArea>
                  }
                })} />
              }
            </div>
        }
      }())}
    </div>
  </ContentLightbox>
}

export default HullDetail