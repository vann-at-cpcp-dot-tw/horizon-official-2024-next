"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useMemo } from 'react'

import { motion } from "framer-motion"
import { twMerge } from 'tailwind-merge'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import { isEmpty } from '~/lib/utils'
import { genSpecString } from "~/lib/utils"

interface TypeTermListNode {
  key: string
  label: string
  spec: {
    metric: string
    imperial: string
  } | undefined
}

interface TypeProps {
  specTerms: {
    [key:string]: {
      metric: string
      imperial: string
    }
  } | undefined
  merged?: boolean
  displayTermKeys?: string[]
  [key:string]: any
}

interface TypeState {}

function SpecTable(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  const { __ } = useTranslate()
  const termsConfig = useMemo(()=>{
    return [
      {
        key: 'loa',
        label: __('L.O.A') as string,
      },
      {
        key: 'lwl',
        label: __('L.W.L')  as string,
      },
      {
        key: 'beam',
        label: __('Beam') as string,
      },
      {
        key: 'draft',
        label: __('Draft') as string,
      },
      {
        key: 'engines',
        label: __('Engines') as string,
      },
      {
        key: 'generator',
        label: __('Generator') as string,
      },
      {
        key: 'displacement',
        label: __('Displacement') as string,
      },
      {
        key: 'fuelCapacity',
        label: __('Fuel Capacity') as string,
      },
      {
        key: 'waterCapacity',
        label: __('Water Capacity') as string,
      },
      {
        key: 'cabins',
        label: __('Cabins') as string,
      }
    ]
  }, [__])
  const termList = useMemo(()=>{
    return termsConfig.reduce((acc:TypeTermListNode[], node, index)=>{
      const fieldKey = node.key
      if( !isEmpty(props?.displayTermKeys) && !props?.displayTermKeys?.includes(fieldKey) ){
        return acc
      }

      if( props.specTerms?.[fieldKey]){
        return [
          ...acc,
          {
            key: node.key,
            label: node.label,
            spec: props.specTerms?.[fieldKey]
          }
        ]
      }

      return acc
    }, [])
  }, [props.specTerms])

  return <Suspense fallback={null}>
    {
      termList && <div className={twMerge('', className)}>
        {
          termList.map((node, index)=>{
            if(!node?.spec?.metric  && !node?.spec?.imperial ){
              return null
            }

            return <motion.div className="border-b border-gray-500 py-3 text-gray-700" key={index}
            variants={{
              enter: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1,
                  delay: index*0.1,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }
              },
              exit: {
                opacity: 0,
                y: 20,
                transition: {
                  duration: 0.5,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }
              }
            }}
            initial="exit"
            exit="exit"
            animate="enter">
              <div className="row lg:flex-nowrap">
                <div className="col-12 lg:col-auto">
                  <div className="serif w-full lg:w-[190px]">{ node.label }</div>
                </div>
                <div className="col-12 shrink text-[15px]">
                  {
                    props.merged
                      ?<div>{ genSpecString([{value:[node?.spec?.metric, node?.spec?.imperial]}]) }</div>
                      :<div className="row">
                        <div className="col-6">{node?.spec?.metric || ''}</div>
                        <div className="col-6">{node?.spec?.imperial || ''}</div>
                      </div>
                  }
                </div>
              </div>
            </motion.div>
          })
        }
      </div>
    }
  </Suspense>
}

export default SpecTable