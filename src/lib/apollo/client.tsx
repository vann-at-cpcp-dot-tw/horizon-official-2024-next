"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { ApolloLink, createHttpLink, makeVar, useReactiveVar } from "@apollo/client"
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev"
import { setContext } from "@apollo/client/link/context"
import { onError } from '@apollo/client/link/error'
import { NextSSRInMemoryCache, NextSSRApolloClient, SSRMultipartLink, ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support/ssr"
import { useLangGuard } from "vanns-common-modules/dist/use/next/useLangGuard"

import { i18n } from "~~/i18n.config"

import { REVALIDATE, FETCH_URI, IMakeApolloClient } from './index'

if (process.env.NODE_ENV === 'development') {
  loadDevMessages()
  loadErrorMessages()
}


// TODO: 此處的 makeClient 和 ./server.ts 裡的 makeClient 為重複 code，曾經嘗試整合兩者(依賴傳入參數決定要 return 哪種 apollo client)，但因 "@apollo/experimental-nextjs-app-support/ssr" module 在 next.js 這種 client/server 混合式框架下，會報錯，當在 server component 下要引入 NextSSRApolloClient，會提示引入不到，反之亦然，所以只能暫時使用重複 code 解決
// 錯誤訊息：Attempted import error: 'NextSSRApolloClient' is not exported from '@apollo/experimental-nextjs-app-support/ssr' (imported as 'NextSSRApolloClient').

function makeApolloClient(args?:IMakeApolloClient){

  const { middlewares } = args ?? {}

  const dynamicUriLink = new ApolloLink((operation, forward) => {
    const { uri: contextUri } = operation.getContext()
    operation.setContext({
      uri: contextUri || FETCH_URI  // 使用 context 中的 uri 或默認 uri
    })
    return forward(operation)
  })

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) =>{
    if ( graphQLErrors ) {
      console.error('Network error:', graphQLErrors)
    }

    if ( networkError ) {
      console.error('Network error:', networkError)
    }
  })

  const middleware = setContext((operation, prevContext) => {
    const { headers:prevHeaders } = prevContext
    return {
      ...prevContext,
      headers: {
        ...prevHeaders,
      }
    }
  })

  const httpLink = createHttpLink({
    uri: FETCH_URI,
    fetchOptions: {
      next: {
        revalidate: REVALIDATE
      },
    },
  })


  const getClient = ()=> new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Yacht: {
          merge: true,
          // merge(existing:any, incoming:any) {
          //   return { ...existing, ...incoming }
          // }
        },
        GlobalSettings: {
          merge: true
        },
      }
    }),
    link: typeof window === "undefined"
      ? ApolloLink.from([
        new SSRMultipartLink({
          stripDefer: true,
        }),
        dynamicUriLink,
        middleware,
        ...(middlewares || []),
        errorLink, // errorLink 要先於 httpLink，否則會無效
        httpLink,
      ])
      : ApolloLink.from([
        dynamicUriLink,
        middleware,
        ...(middlewares || []),
        errorLink, // errorLink 要先於 httpLink，否則會無效
        httpLink,
      ])
  })

  return {
    getClient
  }
}

export function ApolloProvider({
  children
}:{
  children: React.ReactNode,
}){

  const { lang, localeCode } = useLangGuard(i18n)

  return <ApolloNextAppProvider  makeClient={()=>{
    // 添加自定義 context 範例
    // const basicLink = setContext((operation, prevContext) => {
    //   return {
    //     headers: {
    //       "accept-language": localeCode,
    //     }
    //   }
    // })

    // 為 WPGraphQL 增加語言參數，如不需要可拿掉
    const languageLink = new ApolloLink((operation, forward) => {
      const { variables } = operation.getContext()
      operation.variables = {
        ...operation.variables,
        language: (lang as string).toUpperCase(),
        translation: (lang as string).toUpperCase(),
      }
      return forward(operation)
    })

    const { getClient } = makeApolloClient({
      middlewares: [
        // basicLink,
        languageLink
      ]
    })
    return getClient()
  }}>
    { children }
  </ApolloNextAppProvider>
}