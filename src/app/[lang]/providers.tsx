"use client"

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}graphql`

import { useState, ReactNode, createContext } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import dynamic from "next/dynamic"
const DOMLoader = dynamic(() => import('@src/components/custom/dynamic/DOMLoader'), {ssr: false})

import { ApolloLink, HttpLink } from "@apollo/client"
import { ApolloNextAppProvider, NextSSRInMemoryCache, NextSSRApolloClient, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support/ssr"

function makeClient() {
  const httpLink = new HttpLink({
    uri: API_URL,
  })

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: typeof window === "undefined"
      ? ApolloLink.from([
        new SSRMultipartLink({
          stripDefer: true,
        }),
        httpLink,
      ])
      : httpLink,
  })
}

export interface CommonDataContextType {
  yachtSeriesList?: {
    nodes?: {
      slug: string
      name: string
      description?: string
      yachtsSeriesCustomFields?: {
        [key:string]: any
      }
    }[]
  }
  [key: string]: any
}
export const CommonDataContext = createContext<CommonDataContextType>({})

export default function Providers({
  children,
  commonData,
}:{
  children:ReactNode,
  commonData: {
    [key: string]: any
  }
}) {
  const [queryClient] = useState(() => new QueryClient())

  return <ApolloNextAppProvider makeClient={makeClient}>
    <QueryClientProvider client={queryClient}>
      <CommonDataContext.Provider value={commonData}>
        <DOMLoader />
        { children }
      </CommonDataContext.Provider>
    </QueryClientProvider>
  </ApolloNextAppProvider>
}