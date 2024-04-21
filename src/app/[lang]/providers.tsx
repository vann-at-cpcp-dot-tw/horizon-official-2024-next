"use client"

import '~/styles/index.sass'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'


const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}graphql`

import { useState, ReactNode, createContext } from 'react'
import dynamic from "next/dynamic"
import ApolloClientProvider from "~/providers/Apollo"
import { TranslateProvider } from "vanns-common-modules/dist/providers/react/Translate"
import { createScopeStoreProvider } from "vanns-common-modules/dist/providers/react"
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

  return <ApolloClientProvider>
    <CommonDataProvider state={commonData}>
      <TranslateProvider translation={translations}>
        <DOMLoader />
        { children }
      </TranslateProvider>
    </CommonDataProvider>
  </ApolloClientProvider>
}