"use client"
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}graphql`

import '~/styles/index.sass'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import { useState, ReactNode, createContext } from 'react'

import dynamic from "next/dynamic"
import { createScopeStoreProvider } from "vanns-common-modules/dist/providers/react"
import { TranslateProvider } from "vanns-common-modules/dist/providers/react/Translate"

import { ApolloProvider }  from "~/lib/apollo/client"

const DOMLoader = dynamic(() => import('~/components/custom/dynamic/DOMLoader'), {ssr: false})

export interface ICommonData {
  yachtSeriesList: {
    nodes: {
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

export const { ScopeStoreProvider:CommonDataProvider, useScopeStore:useCommonData } = createScopeStoreProvider<ICommonData>()

export default function Providers({
  children,
  commonData,
  translations,
}:{
  children:ReactNode,
  commonData: ICommonData,
  translations: {
    [key: string]: string
  }
}) {

  return <ApolloProvider>
    <CommonDataProvider state={commonData}>
      <TranslateProvider translation={translations}>
        <DOMLoader />
        { children }
      </TranslateProvider>
    </CommonDataProvider>
  </ApolloProvider>
}