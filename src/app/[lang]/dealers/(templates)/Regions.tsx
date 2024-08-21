"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useState } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'
import { motion, AnimatePresence } from "framer-motion"
import { useTranslate } from "vanns-common-modules/dist/use/react"

interface TypeProps {
  [key:string]: any
}
interface TypeState {}

function RegionsNav(props:TypeProps, ref:React.ReactNode){

  const { className } = props
  const [activeRegionIndex, setActiveRegionIndex] = useState<number | null>(null)
  const { __ } = useTranslate()

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="mb-16">
        <div className="container text-center">
          <div className="serif mb-4 text-[32px] text-minor-900">
            { __('Contact Your Local Representative') }
          </div>
        </div>
        <div className="container overflow-auto overflow-y-hidden">
          <div className="row flex-nowrap">
            <div className="col-auto ml-auto">
              <div className={`btn ${activeRegionIndex === null ?'text-major-900' :'text-gray-500'}`}
            onClick={()=>{
              setActiveRegionIndex(null)
            }}>
                { __('Global') }
              </div>
            </div>
            {
              props?.regions?.map((node:{[key:string]:any}, index:number)=>{
                return <div className="col-auto" key={index}
                style={{
                  marginRight: index+1 === props?.regions?.length ?'auto' :'0'
                }}>
                  <div className={`btn ${activeRegionIndex === index ?'text-major-900' :'text-gray-500'}`}
                onClick={()=>{
                  setActiveRegionIndex(index)
                }}>{node?.name}</div>
                </div>
              })
            }
          </div>
        </div>
      </div>

      <div className="container">
        <div className={`dealersColumn ${activeRegionIndex === null ?'columns-2' :'columns-1'}`}>
          {
            props?.regions?.map((node:{[key:string]:any}, index:number)=>{
              if( activeRegionIndex === null || activeRegionIndex === index ){
                return <motion.div
                className="item"
                key={index}
                variants={{
                  enter: {
                    top: '0px',
                    opacity: 1,
                    transition: {
                      duration: 1.6,
                      ease: [0.215, 0.610, 0.355, 1.000]
                    }
                  },
                  exit: {
                    top: '50px',
                    opacity: 0,
                    transition: {
                      duration: 0.5,
                      ease: [0.215, 0.610, 0.355, 1.000]
                    }
                  }
                }}
                initial="exit"
                exit="exit"
                animate="enter">
                  <div className="serif text-[32px] italic text-minor-900">{node?.name}</div>
                  <hr className="mb-3 border-gray-500"/>
                  <div className={`${activeRegionIndex !== null ?'dealersColumn columns-2' :''}`}>
                    {
                      node?.dealers?.nodes?.map((dealerNode:{[key:string]:any}, dealerIndex:number)=>{
                        return <div className="item mb-8" key={`${index}-${dealerIndex}`}>
                          <div className="text-[14px] text-gray-300">{ dealerNode?.dealerRegions?.nodes?.[0]?.name }</div>
                          <div className="mb-1 flex flex-nowrap items-center">
                            <div className="shrink text-[20px] text-gray-700">{ dealerNode?.title }</div>
                            {
                              dealerNode?.dealerCustomFields?.website && <a className="btn-opacity ml-2 mt-0.5 text-golden-900" href={dealerNode?.dealerCustomFields?.website}>Website</a>
                            }
                            {
                              dealerNode.dealerCustomFields?.googleMapLink && <a className="btn-opacity ml-2 mt-0.5 text-golden-900" href={dealerNode.dealerCustomFields.googleMapLink} target="_blank">Map</a>
                            }
                          </div>
                          {
                            dealerNode?.dealerCustomFields?.contactNumber && <div className="mb-0.5 font-300 text-gray-700">
                              <a href={`tel:${dealerNode.dealerCustomFields.contactNumber.replace(' ', '').replace('-', '')}`}>{ dealerNode.dealerCustomFields.contactNumber }</a>
                            </div>
                          }
                          {
                            dealerNode?.dealerCustomFields?.contactEmail && <div className="mb-0.5 font-300 text-gray-700">
                              <a href={`mailto:${dealerNode.dealerCustomFields.contactEmail}`}>{dealerNode.dealerCustomFields.contactEmail}</a>
                            </div>
                          }
                          {
                            dealerNode.dealerCustomFields?.address && <div className="mb-0.5 font-300 text-gray-700">{dealerNode.dealerCustomFields?.address}</div>
                          }
                        </div>
                      })
                    }
                  </div>
                </motion.div>
              }
            })
          }
        </div>
      </div>
    </div>
  </Suspense>
}

export default RegionsNav