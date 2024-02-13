"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, forwardRef, useState, useRef, useReducer, useEffect, useMemo, useCallback } from 'react'

import dynamic from 'next/dynamic'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"

// routes
import { routes } from '@src/routes'
import { useRouter } from 'next/navigation'

// store
import { useStore } from '@src/store'

// use
import { useWindowSize } from 'react-use'
import { useQuery, useMutation, useQueryClient } from 'react-query'

// methods & components
import { isEmpty } from '@src/lib/helpers'
import { twMerge } from 'tailwind-merge'

// styles
import styles from '@src/components/custom/styles/index.module.sass'

interface TypeProps {
  [key:string]: any
}
interface TypeState {}

function __SampleFull(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const router = useRouter()
  const viewport = useWindowSize()
  const [state, setState] = useReducer((state:TypeState, updateState:{})=>({...state, ...updateState}), {
    // init state
  })
  const { className } = props

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}></div>
  </Suspense>
}

export default __SampleFull