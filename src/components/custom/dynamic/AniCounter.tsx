"use client"

const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { isEmpty, numberFormat } from '~/lib/utils'
import { animate, useInView } from "framer-motion"
import { useWindowSize } from 'vanns-common-modules/dist/use/react'

interface TypeProps {
  from: number
  to: number
  duration?: number
  [key:string]: any
}
interface TypeState {}

function DynamicAniCounter(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  const nodeRef = useRef<HTMLDivElement>(null)
  const viewport = useWindowSize()
  const isInView = useInView(nodeRef, {
    margin: `0px 0px -${(viewport.height || 0) / 4}px 0px`,
    // once: viewport.width <= 991,
  })
  const { from, to } = props

  useEffect(() => {
    const node = nodeRef.current

    if( !node || isNaN(from) || isNaN(to) ){
      return
    }

    if( !isInView ){
      node.textContent = props.from === 0 ?'-' :numberFormat(props.from)
      return
    }

    const controls = animate(from, to,{
      duration: props?.duration || 1,
      onUpdate(value) {
        node.textContent = numberFormat(value)
      },
    })

    return () => controls.stop()
  }, [nodeRef.current, from, to, isInView])

  return <span className={twMerge('', className)} ref={nodeRef}></span>
}

export default DynamicAniCounter