"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useCallback, useEffect, useMemo } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { motion } from "framer-motion"

interface TypeProps {
  theme?: string
  background?: string
  isFullScreen?: boolean
  stickyHeader?: React.ReactNode
  closeIcon?: React.ReactNode
  children?: React.ReactNode
  onClose?: Function
  [key:string]: any
}

interface TypeState {}


function ContentLightbox(props:TypeProps, ref:React.ReactNode){
  const { className, theme='light' } = props

  const backgrounds = {
    light: '#f3f0ea',
    dark: '#121212',
  } as Record<string, string>

  const background = props.background || backgrounds?.[theme] || backgrounds.light

  const CloseIcon = useCallback(()=>{
    const icons = {
      light: <Image src={`${BASE_PATH}/assets/img/icon_menu_x.svg`} width={48} height={48} alt=""/>,
      dark: <Image src={`${BASE_PATH}/assets/img/icon_menu_x.svg`} width={48} height={48} alt=""
      style={{
        filter: theme === 'light' ?'' :'grayscale(100) brightness(1000)',
      }} />
    } as Record<string, React.ReactNode>

    return props?.closeIcon || icons[theme] || icons.light
  }, [theme, props.closeIcon])

  useEffect(()=>{
    document.body.classList.add('lb-open')
    return ()=>{
      document.body.classList.remove('lb-open')
    }
  }, [])

  return <Suspense fallback={null}>
    <motion.div className={twMerge('fixed left-0 top-0 z-[9999] size-full', className)}
    variants={{
      enter: {
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: [0.215, 0.610, 0.355, 1.000]
        }
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.5,
          ease: [0.215, 0.610, 0.355, 1.000]
        }
      },
    }}
    initial="exit"
    animate="enter"
    style={{
      background
    }}>
      <div className={`absolute left-0 top-0 flex size-full flex-col ${props?.isFullScreen ?'overflow-hidden' :'overflow-auto'}`}>
        <div className="sticky left-0 top-0 z-10 flex">
          {
            (props?.onClose || props?.closeIcon) && <div className="btn flex-none"
            style={{
              background
            }}
            onClick={(e)=>{
              e.stopPropagation()
              props?.onClose?.()
            }}>
              <CloseIcon />
            </div>
          }
          <div className="w-full">{ props?.stickyHeader }</div>
        </div>

        { props?.children }
      </div>
    </motion.div>
  </Suspense>
}

export default ContentLightbox