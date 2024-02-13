"use client"

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react'

// routes
import { routes } from '@src/routes'

// store
import { useStore } from '@src/store'

// use
import { useWindowSize } from 'react-use'

// methods & components
import { isEmpty } from '@src/lib/helpers'

// styles
// import styles from '@src/components/custom/styles/index.module.sass'

import { twMerge } from 'tailwind-merge'

interface TypeProps {
  ratio: number | string
  children: React.ReactNode
  className?: string
}

function RatioArea(props:TypeProps){
  return (
    <div className={twMerge('ratioArea relative w-full', props?.className)}>
      <div className="fill pointer-events-none relative" style={{
        width: '100%',
        paddingBottom: `${props.ratio}%`
      }}></div>
      { props.children }
    </div>
  )
}


export default RatioArea