
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { fetchGQL } from '~/lib/apollo'
import { QueryPublicationsPage } from '~/queries/pages/publications.gql'
import LocalDataProvider from "./(templates)/LocalDataProvider"
import PageTop from './(templates)/PageTop'
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'


export interface TypePublicationNode {
  slug: string
  title: string
  publicationCustomFields: {
    publication: {
      publicationCover: {
        node?: {
          mediaItemUrl?: string
          mediaDetails?: {
            width: number
            height: number
          }
        }
      }
      pdf: {
        node?: {
          mediaItemUrl?: string
        }
      }
      placeholder?: string
    }
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

export default async function LayoutPublications({params, children}:TypeProps){

  const data = await fetchGQL(QueryPublicationsPage, {
    context: {
      uri: HQ_API_URL
    }
  })
  const { publicationCategories } = data ?? {}

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
