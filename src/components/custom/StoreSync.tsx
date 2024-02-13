"use client"

import { Suspense, forwardRef, useState, useRef, useReducer, useEffect, useMemo, useCallback } from 'react'

import dynamic from 'next/dynamic'
import Link from 'next/link'

// routes
import { routes, TypeRouteNode } from '@src/routes'
import { useRouter, usePathname } from 'next/navigation'

// store
import { useStore } from '@src/store'

// use
import { useWindowSize } from 'react-use'

// methods & components
import { isEmpty } from '@src/lib/helpers'

interface TypeProps {
  data: {}
}

interface TypeState {}

function StoreSync(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const router = useRouter()
  const pathname = usePathname()
  const viewport = useWindowSize()
  const [state, setState] = useReducer((state:TypeState, updateState:{})=>({...state, ...updateState}), {
    // init state
  })

  const currentRoute = useMemo(()=>{

    function findPathname(routes:TypeRouteNode[] , pathname:string):TypeRouteNode | void{
      for (const route of routes){
        if (route.pathname === pathname){
          return route
        }
        if (route.children){
          const result = findPathname(route.children, pathname)
          if (result){
            return result
          }
        }
      }
    }

    return findPathname(routes, pathname)

  }, [pathname])

  useEffect(()=>{
    store.set(props.data)
  }, [props.data])

  useEffect(()=>{
    store.set({
      currentRoute
    })
  }, [currentRoute])

  return null
}

export default StoreSync