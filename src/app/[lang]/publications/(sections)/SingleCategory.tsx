"use client"

const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useMemo, useContext, useState } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { useParams } from "next/navigation"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'
import { ICommonData, useCommonData } from "~/app/[lang]/providers"
import { useLazyQuery } from "@apollo/client"
import { QueryPublicationCategory } from '~/queries/pages/publications-[publicationCategorySlug].gql'
import { TypePublicationCategoryNode, TypePublicationNode } from "../layout"
import { useImageBlurHashes } from 'vanns-common-modules/dist/use/next'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import Loading from '~/components/custom/icons/Loading'
import PageNav from '~/components/custom/PageNav'
import RatioArea from "vanns-common-modules/dist/components/react/RatioArea"

interface TypeProps {
  publicationCategory: {
    name: string
    publications: {
      nodes: {
        slug: string
        title: string
        publicationCustomFields: {
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
      pageInfo: {
        hasNextPage: boolean
        hasPreviousPage: boolean
        startCursor: string
        endCursor: string
      }
    }
  }
  [key:string]: any

}
interface TypeState {}

function SingleCategory(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const params = useParams()
  const { lang, publicationCategorySlug } = params
  const commonData = useCommonData()
  const { yachtSeriesList } = commonData ?? {}
  const[getData, { data, loading }] = useLazyQuery<{publicationCategory:TypePublicationCategoryNode}>(QueryPublicationCategory)
  const [queryYachtSeries, setQueryYachtSeries] = useState('')
  const publicationCategory = useMemo<TypePublicationCategoryNode>(()=>{
    return (data?.publicationCategory || props?.publicationCategory)
  }, [props.publicationCategory, data])
  const images = useMemo<string[]>(()=>{
    return publicationCategory?.publications?.nodes?.map?.((node:any)=>{
      return node?.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl || ''
    }) || []
  }, [publicationCategory])
  const viewport = useWindowSize()
  const placeholders = useImageBlurHashes(images)

  if( loading ){
    return <div className="flex h-full flex-col items-center justify-center">
      <Loading style={{width:'120px'}} fill="var(--color-golden-900)"/>
    </div>
  }

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container-fluid mb-8 px-5 lg:px-20">
        <div className="row row-gap-2 -mt-12 mb-12 !flex-nowrap items-baseline justify-center">
          <div className="col-auto text-gray-700">Select by</div>
          <div className="col-auto shrink">
            <div className="w-screen max-w-[180px]">
              <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
              value={queryYachtSeries}
              onChange={(e)=>{
                setQueryYachtSeries(e.target.value)
                getData({
                  variables: {
                    slug: publicationCategorySlug,
                    first: 12,
                    relatedYachtSeries: e.target.value || null
                  }
                })
              }}>
                <option value="">All Series</option>
                {
                  yachtSeriesList?.nodes?.map((node:ICommonData['yachtSeriesList']['nodes'][number], index:number)=>{
                    return <option key={index} value={node.slug}>{node.name} Series</option>
                  })
                }
              </select>
            </div>
          </div>
        </div>

        <div className="row lg:row-gap-8 items-end">
          {
            publicationCategory?.publications?.nodes?.map((node:TypePublicationNode, index:number)=>{
              return <div className="col-6 lg:col-3 mb-10 lg:mb-8" key={index}>
                <a className="btn group relative block" href={node.publicationCustomFields?.publication?.pdf?.node?.mediaItemUrl} target="_blank">
                  <div className="relative">
                    <div className="pointer-events-none absolute left-0 top-0 z-10 flex size-full items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100"
                        style={{
                          background: 'rgba(0, 46, 79, 0.5)',
                          transition: 'all .4s'
                        }}>
                      <div className="flex size-[56px] items-center justify-center rounded-full bg-golden-700">
                        <i className="bi bi-plus-lg text-[24px] text-white"></i>
                      </div>
                    </div>
                    {
                      node?.publicationCustomFields?.publication?.publicationCover?.node?.mediaDetails?.width && <div className="relative mb-2">
                        <RatioArea ratio={(node.publicationCustomFields.publication.publicationCover.node.mediaDetails?.height / node.publicationCustomFields.publication.publicationCover.node.mediaDetails.width * 100) as number}>
                          <Image className="absolute size-full"
                          src={`${node.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl || ''}`}
                          alt=""
                          fill
                          sizes={viewport.width && viewport.width >= 992 ?'25vw' :'50vw'}
                          style={{
                            objectFit: 'cover',
                          }}
                          placeholder={placeholders?.[index] ?'blur' :'empty'}
                          blurDataURL={placeholders?.[index]} />
                        </RatioArea>
                      </div>
                    }


                  </div>
                  <div className="relative h-8 text-gray-500">
                    <div className="absolute line-clamp-2 w-full">{ node.title }</div>
                  </div>
                </a>
              </div>
            })
          }
        </div>
      </div>

      <PageNav
      pageInfo={publicationCategory?.publications?.pageInfo}
      onPrevClick={()=>{
        getData({
          variables: {
            slug: publicationCategorySlug,
            before: publicationCategory?.publications?.pageInfo?.startCursor,
            last: 12,
          }
        })
      }}
      onNextClick={()=>{
        getData({
          variables: {
            slug: publicationCategorySlug,
            after: publicationCategory?.publications?.pageInfo?.endCursor,
            first: 12,
          }
        })
      }} />
    </div>
  </Suspense>
}

export default SingleCategory