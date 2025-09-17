"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useEffect, useState, useCallback, useMemo } from 'react'

import { useScroll, useMotionValueEvent } from "framer-motion"
import { twMerge } from 'tailwind-merge'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { useStore } from '~/store'

interface TypeProps {
  allowed?: string[]
  [key:string]: any
}
interface TypeState {}

function scrollTo(targetSelector:string, offset=0){
  const app = (document.getElementById('app') as HTMLElement)
  const target = (document.querySelector(targetSelector) as HTMLElement)
  if( !target || !app ){
    return
  }

  window.scrollTo({
    top: target.offsetTop - (Number(app.style.paddingTop.split('px')[0])  + offset),
    behavior: 'smooth'
  })
}

function SectionNav(props:TypeProps){
  const topOffset = 8
  const store = useStore()
  const { __ } = useTranslate()
  const [navRefNode, setNavRefNode] = useState<HTMLDivElement | null>(null)
  const { className } = props
  const { scrollY } = useScroll()
  const navRefCallback = useCallback((refNode:HTMLDivElement)=>{
    setNavRefNode(refNode)
  }, [])

  useMotionValueEvent(scrollY, "change", (latest)=>{
    if( !navRefNode ){
      return
    }

    if( navRefNode?.getBoundingClientRect?.()?.y <= store.headerHeight - topOffset ){
      // sticked!!
      navRefNode.style.boxShadow = 'rgba(0, 0, 0, 0.15) 0px 10px 5px -5px'
    }else{
      navRefNode.style.boxShadow = ''
    }

    // 當 sticked 時，要壓在 header 之上，以蓋住 header 的陰影，但當解除 sticked 要滾走時，要回歸 header 底下，不可壓到 header
    if( navRefNode?.getBoundingClientRect?.()?.y < store.headerHeight - topOffset ){
      navRefNode.style.zIndex = '99'
    }else{
      navRefNode.style.zIndex = '101'
    }
  })

  const allowed = useMemo<string[]>(()=>{
    if( Array.isArray(props.allowed) ){
      return props.allowed
    }
    return ['Exterior', 'Interior', 'SPEC', 'GA', 'VR', 'Video']
  }, [props.allowed])

  return <Suspense fallback={null}>
    <div ref={navRefCallback} className={twMerge('sticky left-0 bg-golden-100 pb-4 lg:mb-4 mb-3 lg:pt-0 pt-3', className)} {...props}
    style={{
      top: `${store.headerHeight - topOffset}px`
    }}>
      <div className="container">
        <div className="row justify-center text-[13px] lg:text-[16px]">
          {
            allowed.includes('Exterior') && <div className="col-auto">
              <div className="btn text-gray-700"
              onClick={()=>{
                scrollTo('#SECTION_EXTERIOR')
              }}>{ __('Exterior') }</div>
            </div>
          }

          {

            allowed.includes('Interior') && <div className="col-auto">
              <div className="btn text-gray-700"
              onClick={()=>{
                scrollTo('#SECTION_INTERIOR', -20)
              }}>{ __('Interior') }</div>
            </div>
          }

          {
            allowed.includes('Features') && <div className="col-auto">
              <div className="btn text-gray-700"
              onClick={()=>{
                scrollTo('#SECTION_FEATURES', -50)
              }}>{ __('Features') }</div>
            </div>
          }

          {
            allowed.includes('Pricing & Toys') && <div className="col-auto">
              <div className="btn text-gray-700"
              onClick={()=>{
                scrollTo('#SECTION_PRICING_TOYS', -50)
              }}>{ __('Pricing & Toys') }</div>
            </div>
          }

          {
            allowed.includes('SPEC') && <div className="col-auto">
              <div className="btn text-gray-700"
              onClick={()=>{
                scrollTo('#SECTION_SPEC', -50)
              }}>{ __('SPEC') }</div>
            </div>
          }

          {
            allowed.includes('GA') && <div className="col-auto">
              <div className="btn text-gray-700"
              onClick={()=>{
                scrollTo('#SECTION_GA', -50)
              }}>{ __('GA') }</div>
            </div>
          }

          {
            allowed.includes('VR') && <div className="col-auto">
              <div className="btn text-gray-700"
              onClick={()=>{
                scrollTo('#SECTION_VR', -50)
              }}>{ __('VR') }</div>
            </div>
          }

          {
            allowed.includes('Video') && <div className="col-auto">
              <div className="btn text-gray-700"
              onClick={()=>{
                scrollTo('#SECTION_VIDEO', -50)
              }}>{ __('Video') }</div>
            </div>
          }
        </div>
      </div>
    </div>
  </Suspense>
}

export default SectionNav