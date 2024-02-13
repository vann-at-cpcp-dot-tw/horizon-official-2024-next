
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { fetchGQL } from "@src/lib/apollo"
import { QueryPublicationsPage } from '@src/queries/pages/publications.gql'
import LocalDataProvider from "./(templates)/LocalDataProvider"
import PageTop from './(templates)/PageTop'


export interface TypePublicationNode {
  slug: string
  title: string
  publicationCustomFields: {
    album: {
      image?: {
        node?: {
          mediaItemUrl: string
        }
      }
    }[]
    relatedYachts?: {
      seriesSlug: string
    }[]
  }
}

export interface TypePublicationCategoryNode {
  name: string
  slug?: string
  publications: {
    nodes: TypePublicationNode[]
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string
      endCursor: string
    }
  }
  [key:string]: any
}



interface TypeProps {
  params: {
    data: {
      [key:string]: any
    }
  }
  & {
    [key:string]: string
  }
  children: React.ReactNode
}

interface TypeState {}

async function LayoutPublications({params, children}:TypeProps){

  const data = await fetchGQL(QueryPublicationsPage)
  const { publicationCategories } = data ?? {}
  params.data = data

  return <main
  className="grow"
  style={{
    background: '#EEEBE6',
  }}>
    <PageTop className="pb-20" publicationCategories={publicationCategories} />
    <LocalDataProvider data={data}>
      { children }
    </LocalDataProvider>
  </main>
}

export default LayoutPublications