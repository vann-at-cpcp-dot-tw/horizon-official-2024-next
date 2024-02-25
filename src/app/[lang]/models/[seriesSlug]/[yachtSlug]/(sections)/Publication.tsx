"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useState, useId } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'

interface TypeProps {
  title: string
  publicationCustomFields?: {
    publication: {
      publicationCover: {
        node?: {
          mediaItemUrl?: string
        }
      }
      pdf: {
        node?: {
          mediaItemUrl?: string
        }
      }
    }
  }
  [key:string]: any
}
interface TypeState {}

function Publication(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  const coverImage = useMemo(()=>{
    return props?.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl
  }, [props?.publicationCustomFields?.publication])

  if( !props.title || !coverImage){
    return null
  }

  return <Suspense fallback={null}>
    <div className={twMerge('bg-[#E6E3DD] lg:py-20 py-12 pb-16', className)}>
      <div className="container mb-6 text-center text-[17px] text-gray-500">Brochure</div>
      <div className="container">
        <div className="row justify-center">
          {
            <div className="col-12 flex justify-center lg:col-auto">
              <a className="btn block"
              href={props?.publicationCustomFields?.publication?.pdf?.node?.mediaItemUrl}
              target="_blank"
              style={{
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                <Image src={coverImage} width={420} height={300} alt="" />
              </a>
            </div>
          }
        </div>
      </div>
    </div>
  </Suspense>
}

export default Publication