"use client"

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react'

// routes
import { routes } from '@src/routes'

// store
import { useStore } from '@src/store'

// use
import { useWindowSize } from 'react-use'
import { twMerge } from 'tailwind-merge'

// methods & components
import { isEmpty } from '@src/lib/helpers'

// styles
import styles from '@src/components/custom/styles/index.module.sass'

interface TypeProps {
  id: string
  className?: string
  color?: string
}

function LightboxClose(props:TypeProps){

  const store = useStore()
  const viewport = useWindowSize()

  useEffect(()=>{
    function lightboxClickHandler(e:MouseEvent){
      const target = e.target as HTMLElement
      const targetId = target.id
      if( target.dataset.el === 'lightbox' ){
        store.lightboxClose(targetId)
      }
    }

    document.body.addEventListener('click', lightboxClickHandler)

    return function(){
      document.body.removeEventListener('click', lightboxClickHandler)
    }
  }, [])

  return <div className={twMerge('close flex justify-end', props?.className)}>
    <div className="btn flex h-10 w-10 items-center justify-center"
    onClick={()=>{
      store.lightboxClose(props.id)
    }}
    style={{
      marginRight: viewport.width >= 992 ?'-20px' :'-10px',
      marginTop: viewport.width >= 992 ?'-20px' :'-10px',
    }}>
      <i className="bi bi-x-lg font-900 text-[28px] leading-none text-secondary lg:text-[32px]"
      style={{
        color: props.color,
      }}></i>
    </div>
  </div>
}

export default LightboxClose