"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION
const postsPerPage = 30

import { Suspense, useState, useMemo, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/helpers'
import { QueryBrokerages } from '~/queries/pages/brokerage.gql'
import { QueryCharters } from '~/queries/pages/charter.gql'
import { useLazyQuery } from "@apollo/client"
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import ListFilters from "./ListFilters"
import ListItem from "./ListItem"
import PageNav from '~/components/custom/PageNav'
import Loading from '~/components/custom/icons/Loading'

interface TypeUsedYachtNode {
  [key:string]: any
}

interface TypeProps {
  list?: TypeUsedYachtNode[],
  queryPostType?: String
  pageInfo?: {
    endCursor: string
    hasNextPage: string
    hasPreviousPage: string
    startCursor: string
  }
  yachtConditions?: {
    slug: string
    name: string
  }[]
  lengthOptions?: {
    label: string
    minValue: string | number
    maxValue: string | number
  }[]
  priceOptions?: {
    label: string
    minValue: string | number
    maxValue: string | number
  }[]
  yearOptions?: (string | number)[]
  [key:string]: any
}

interface TypeState {}

function List(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const viewport = useWindowSize()
  const { className } = props
  const params = useParams()
  const { lang } = params
  const searchParams = useSearchParams()
  const [mergedList, setMergedList] = useState<TypeUsedYachtNode[] | null>(null)
  const[getData, { data, loading }] = useLazyQuery(props?.queryPostType === 'charter' ?QueryCharters :QueryBrokerages, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setMergedList((prev)=>{
        return [
          ...(prev === null ?[] :prev),
          ...data?.posts?.nodes
        ]
      })
    },
  })

  const pageInfo = useMemo(()=>{
    return data?.posts?.pageInfo || props?.pageInfo
  }, [data?.posts?.pageInfo, props.pageInfo ])

  const queryCondition = searchParams.get('condition')
  const queryYachtLength = searchParams.get('length')
  const queryYachtPrice = searchParams.get('price')
  const queryYachtYear = searchParams.get('year')
  const queryOrderby = searchParams.get('orderby')

  const queryVariables = useMemo(()=>{
    return {
      first: postsPerPage,
      ...(
        queryCondition
          ? {
            yachtConditions: [queryCondition],
            yachtConditionsOperator: 'IN'
          }:{
            yachtConditions: [],
            yachtConditionsOperator: 'NOT_IN'
          }
      ),
      yachtYear: queryYachtYear,
      yachtPriceRange: queryYachtPrice,
      yachtLengthRange: queryYachtYear,
      customOrderby: queryOrderby,
    }
  }, [queryCondition, queryYachtLength, queryYachtPrice, queryYachtYear, queryOrderby])

  useEffect(()=>{

    setMergedList(null)

    // 第一次進頁面，URL 還未做過任何查詢時
    if(
      props.list
      && queryCondition === null
      && queryYachtLength === null
      && queryYachtPrice === null
      && queryYachtYear === null
      && queryOrderby === null
    ){
      setMergedList((prev)=>{
        const uniqueSet = new Set()
        const uniqueList = [
          ...(prev === null ?[] :prev),
          ...(props?.list || [])
        ].filter(item => {
          if( !item?.slug || uniqueSet.has(item.slug)){
            return false
          }
          uniqueSet.add(item.slug)
          return true
        })
        return uniqueList
      })
      return
    }

    getData({
      variables: queryVariables
    })

  }, [queryCondition, queryYachtLength, queryYachtPrice, queryYachtYear, queryOrderby, props.list])

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <ListFilters
      className="mb-4"
      yachtConditions={props.yachtConditions}
      lengthOptions={props.lengthOptions}
      priceOptions={props.priceOptions}
      yearOptions={props.yearOptions} />

      <div className="container">
        <div className="row">
          {
            mergedList?.map((node, index)=>{
              return <div className="lg:col-6 col-12 mb-10" key={index}>
                <ListItem
                title={node.title}
                slug={node.slug}
                thumbnail={node?.customFields?.exteriorImages?.[0]?.image?.node?.mediaItemUrl}
                lang={lang}
                href={`/${props?.queryPostType === 'charter' ?'charter' :'brokerage'}/${node.slug}`}
                infos={[
                  `${node?.customFields?.specTerms?.loa?.imperial || ''} (${node?.customFields?.specTerms?.loa?.metric || ''})`,
                  `${node?.customFields?.specTerms?.beam?.imperial || ''} (${node?.customFields?.specTerms?.beam?.metric || ''})`,
                  `${node?.customFields?.specTerms?.engines?.imperial || ''}`,
                ]} />
              </div>
            })
          }
        </div>
      </div>


      {
        loading
          ?<Loading style={{width:'44px'}} fill="var(--color-golden-900)"/>
          :<div className="pt-5">
            <PageNav
            pageInfo={pageInfo}
            moreMode
            moreText="More"
            onNextClick={()=>{
              getData({
                variables: {
                  ...queryVariables,
                  after: pageInfo?.endCursor,
                  first: postsPerPage,
                }
              })
            }} />
          </div>
      }

    </div>
  </Suspense>
}

export default List