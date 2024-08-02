const APP_URL = process.env.NEXT_PUBLIC_APP_URL || ''
const API_BASE = process.env.NEXT_PUBLIC_API_BASE
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import { QueryPostsForSiteMap } from '~/queries/sitemap/posts.gql'
import { fetchGQL } from "~/lib/apollo"
import { formatPostCategories } from "~/lib/utils"
import { MetadataRoute } from 'next'

const genSitemapObjects = async () => {

  const data = await fetchGQL(QueryPostsForSiteMap, {
    context: {
      uri: HQ_API_URL
    },
  })

  const news = data?.news?.nodes?.map?.((node:any)=>{
    const filteredCategories = formatPostCategories(node?.categories?.nodes)
    return {
      url: `${APP_URL}/news/${filteredCategories?.[0]?.slug}/${node.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly'
    }
  }) || []

  const events = data?.categoryEvents?.translation?.posts?.nodes?.map?.((node:any)=>{
    return {
      url: `${APP_URL}/news/events/${node.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly'
    }
  }) || []

  const yachtSeries = data?.yachtSeriesList?.nodes?.map?.((node:any)=>{
    const seriesSlug = node?.slug
    return {
      url: `${APP_URL}/models/${seriesSlug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly'
    }
  }) || []

  const yachts = data?.yachtSeriesList?.nodes?.reduce?.((acc:any, node:any)=>{
    const seriesSlug = node?.slug
    const yachts = node?.yachts?.nodes?.map((yachtNode:any)=>{
      return {
        url: `${APP_URL}/models/${seriesSlug}/${yachtNode?.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly'
      }
    }) || []
    return [
      ...acc,
      ...yachts,
    ]
  }, []) || []

  return [
    ...news,
    ...events,
    ...yachtSeries,
    ...yachts
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
    ...['design-and-craft', 'horizon', 'innovation', 'the-group'].map<{url:string, changeFrequency:'monthly'}>((pathname)=>{
      return {
        url: `${APP_URL}/about/${pathname}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
      }
    }),
    ...['contact', 'dealears', 'investor', 'models', 'privacy-policy', 'publications', 'QA', 'terms-and-conditions'].map<{url:string, changeFrequency:'monthly'}>((pathname)=>{
      return {
        url: `${APP_URL}/${pathname}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
      }
    }),
    {
      url: `${APP_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
    },
    {
      url: `${APP_URL}/news/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
    },
    ...(await genSitemapObjects())
  ]
}