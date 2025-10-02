"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`
const postsPerPage = 3

import { Suspense, useMemo } from 'react'

import { useQuery } from "@apollo/client"
import { twMerge } from 'tailwind-merge'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { QueryRelatedPosts } from '~/queries/pages/news-[categorySlug]-[postSlug].gql'

import NewsListItem from "./ListItem"
import { formatCategories } from "./ListItem"

interface TypeProps {
  categorySlug: string
  postCursor: string
  [key:string]: any
}

interface TypeState {}


function RelatedPosts(props:TypeProps){
  const { className } = props

  const { data:nextPosts } = useQuery(QueryRelatedPosts, {
    fetchPolicy: 'cache-and-network',
    skip: !props.postCursor || !props.categorySlug,
    context: {
      uri: HQ_API_URL
    },
    variables: {
      categorySlug: props.categorySlug,
      after: props.postCursor,
      first: postsPerPage,
    }
  })

  const { data:prevPosts } = useQuery(QueryRelatedPosts, {
    fetchPolicy: 'cache-and-network',
    skip: !props.postCursor || !props.categorySlug,
    context: {
      uri: HQ_API_URL
    },
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
                thumbnail={node?.postCustomFields?.gallery?.[0]?.image?.node}
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