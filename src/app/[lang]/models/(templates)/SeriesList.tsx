const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { Suspense, useContext, useEffect } from 'react'
import { QueryYachtsWithSeries } from '~/queries/pages/models.gql'
import { fetchGQL } from '~/lib/apollo'
import { isEmpty } from '~/lib/helpers'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'

interface TypeProps {
  lang: string
}
interface TypeState {}
interface TypeYachtNode {
  slug: string
  title: string
}

async function SeriesList(props:TypeProps, ref:React.ReactNode){
  const { lang } = props
  const data = await fetchGQL(QueryYachtsWithSeries)
  const { yachtSeriesList } = data ?? {}
  const yachtSeriesListWithPlaceholder = await Promise.all(
    yachtSeriesList?.nodes?.map?.(async (node:any) => {
      return {
        ...node,
        image: node?.image?.node?.mediaItemUrl || '',
        placeholder: await genImageBlurHash(node?.image?.node?.mediaItemUrl)
      }
    })
  )

  return <Suspense fallback={null}>
    <div className="flex">
      {
        yachtSeriesListWithPlaceholder?.map((node:any, index:number)=>{
          return <div className="mb-10 w-full lg:w-1/2" key={index}>

            <RatioArea className="mb-4" ratio="63.47">
              <LinkWithLang className="absolute left-0 top-0 size-full" href={`/models/${node.slug}`} lang={props.lang}>
                <Image className="absolute left-0 top-0 z-0 size-full object-cover"
                fill={true}
                src={node?.yachtsSeriesCustomFields?.seriesKeyImage?.node?.mediaItemUrl || ''}
                alt=""
                placeholder={node?.placeholder ?'blur' :'empty'}
                blurDataURL={node?.placeholder} />
              </LinkWithLang>
            </RatioArea>
            <div className="px-5 lg:px-12">
              <div className="flex">
                <LinkWithLang
                className="serif text-[24px] leading-none text-golden-900 lg:text-[32px]"
                href={`/models/${node.slug}`}
                lang={props.lang}>{node?.name}
                </LinkWithLang>
              </div>

              {
                node?.yachtsSeriesCustomFields?.seriesSimpleDescription && <div className="serif my-1.5 leading-[1.1] text-minor-900 lg:text-[18px]">{node?.yachtsSeriesCustomFields?.seriesSimpleDescription}</div>
              }

              <div className="flex">
                {
                  node?.yachts?.nodes?.map((yachtNode:TypeYachtNode, yachtNodeIndex:number)=>{
                    return <div className="pr-2.5" key={yachtNodeIndex}>
                      <LinkWithLang className="block pb-1.5 text-gray-500" href={`/models/${node.slug}`} lang={props.lang}>
                        { yachtNode.title }
                      </LinkWithLang>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
        })
      }
    </div>
  </Suspense>
}

export default SeriesList