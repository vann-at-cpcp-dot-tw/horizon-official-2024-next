"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const postsPerPage = 3

import { Suspense, useMemo } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { useQuery } from "@apollo/client"
import { QueryRelatedPosts } from "@src/queries/pages/news-[categorySlug]-[postSlug].gql"
import NewsListItem from "./ListItem"
import { formatCategories } from "./ListItem"
// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

interface TypeProps {
  categorySlug: string
  postCursor: string
  [key:string]: any
}

interface TypeState {}


function RelatedPosts(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props

  const { data:nextPosts } = useQuery(QueryRelatedPosts, {
    skip: !props.postCursor || !props.categorySlug,
    variables: {
      categorySlug: props.categorySlug,
      after: props.postCursor,
      first: postsPerPage,
    }
  })

  const { data:prevPosts } = useQuery(QueryRelatedPosts, {
    skip: !props.postCursor || !props.categorySlug,
    variables: {
      categorySlug: props.categorySlug,
      before: props.postCursor,
      last: postsPerPage,
    }
  })

  const posts = useMemo(()=>{
    return [
      ...(nextPosts?.category?.posts?.nodes || []),
      ...(prevPosts?.category?.posts?.nodes || []),
    ]
  }, [nextPosts?.category?.posts?.nodes, prevPosts?.category?.posts?.nodes])

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container">
        <div className="row">
          {
            posts?.map((node:{[key:string]:any}, index)=>{
              return <div className="lg:col-4 col-12 mb-6" key={index}>
                <NewsListItem
                href={`/news/${props.categorySlug}/${node.slug}`}
                title={node?.title}
                date={node?.date}
                thumbnail={node?.postCustomFields?.gallery?.[0]?.image?.node?.mediaItemUrl || ''}
                categories={formatCategories(node?.categories?.nodes)} />
              </div>
            })
          }
        </div>
      </div>
    </div>
  </Suspense>
}

export default RelatedPosts