"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useCallback, useEffect, useMemo } from 'react'

import { motion } from "framer-motion"
import { twMerge } from 'tailwind-merge'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

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


function ContentLightbox(props:TypeProps){
  const { className, theme='light' } = props

  const backgrounds = {
    light: '#f3f0ea',
    dark: '#121212',
  } as Record<string, string>

  const background = props.background || backgrounds?.[theme] || backgrounds.light

  const CloseIcon = useCallback(()=>{
    const icons = {
      light: <img src={`${APP_BASE}assets/img/icon_menu_x.svg`} style={{width:'48px', height:'48px'}}/>,
      dark: <img src={`${APP_BASE}assets/img/icon_menu_x.svg`} style={{
        width:'48px',
        height:'48px',
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
        <div className="left-0 top-0 z-10 flex lg:sticky"
        style={{
          background
        }}>
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
          <div className="relative w-full">{ props?.stickyHeader }</div>
        </div>

        <div className="relative flex grow flex-col">
          { props?.children }
        </div>
      </div>
    </motion.div>
  </Suspense>
}

export default ContentLightbox