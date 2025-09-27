"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { useEffect, useRef } from 'react'

import { animate, useInView } from "framer-motion"
import { twMerge } from 'tailwind-merge'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'

import { isEmpty, numberFormat } from '~/lib/utils'

interface TypeProps {
  from: number
  to: number
  duration?: number
  [key:string]: any
}
interface TypeState {}

function DynamicAniCounter(props:TypeProps){
  const { className } = props
  const nodeRef = useRef<HTMLDivElement>(null)
  const viewport = useWindowSize()
  const isInView = useInView(nodeRef, {
    margin: `0px 0px -${(viewport.height || 0) / 4}px 0px` as any,
    // once: viewport.width <= 991,
  })

  useEffect(() => {
    const node = nodeRef.current

    if( !node || isNaN(props.from) || isNaN(props.to) ){
      return
    }

    if( !isInView ){
      node.textContent = props.from === 0 ?'-' :numberFormat(props.from)
      return
    }

    const controls = animate(props.from, props.to,{
      duration: props?.duration || 1,
      onUpdate(value) {
        node.textContent = numberFormat(value)
      },
    })

    return () => controls.stop()
  }, [props.duration, props.from, props.to, isInView])

  return <span className={twMerge('', className)} ref={nodeRef}></span>
}

export default DynamicAniCounter