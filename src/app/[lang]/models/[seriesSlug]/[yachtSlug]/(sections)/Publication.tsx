const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import T from 'vanns-common-modules/dist/components/react/T'
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  list: {
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
  }[]
  [key:string]: any
}
interface TypeState {}

async function Publication(props:TypeProps){
  const { className } = props
  if( isEmpty(props?.list) ){
    return null
  }
  const listWithPlaceholder = await Promise.all(props?.list?.map(async (node) => {
    return {
      ...node,
      placeholder: await genImageBlurHash(node?.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl || '')
    }
  }))

  return <Suspense fallback={null}>
    <div className={twMerge('bg-[#E6E3DD] lg:py-20 py-12', className)}>
      <div className="container mb-6 text-center text-[17px] text-gray-500">
        <T text="Brochure" />
      </div>
      <div className="container">
        <div className={`row ${listWithPlaceholder?.length < 4 ?'lg:justify-center' :''}`}>
          {
            listWithPlaceholder?.map((node, index)=>{
              return <div className="col-6 lg:col-3 mb-6 flex" key={index}>
                <a className="btn block"
                href={node?.publicationCustomFields?.publication?.pdf?.node?.mediaItemUrl}
                target="_blank"
                style={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'
                }}>
                  <Image
                  src={node?.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl || ''}
                  className="w-full"
                  width={330}
                  height={238}
                  alt=""
                  placeholder={node?.placeholder ?'blur' :'empty'}
                  blurDataURL={node?.placeholder} />
                </a>
              </div>
            })

          }
        </div>
      </div>
    </div>
  </Suspense>
}

export default Publication