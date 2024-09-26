import { ApolloLink, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc"
import { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { headers, cookies } from 'next/headers'
import { tools as langTools } from "vanns-common-modules/dist/use/next/useLangGuard"

import { i18n } from "~~/i18n.config"

import { REVALIDATE, FETCH_URI, IFetchGQLArgs, IMakeApolloClient } from './index'


const { convertLocaleCode } = langTools(i18n)

function makeApolloClient(args?:IMakeApolloClient){
  const { middlewares } = args ?? {}

  const { getClient } = registerApolloClient(()=>{
    // 為了讓每次 fetch 都能動態改 uri
    const dynamicUriLink = new ApolloLink((operation, forward) => {
      const { uri: contextUri } = operation.getContext()
      operation.setContext({
        uri: contextUri || FETCH_URI  // 使用 context 中的 uri 或默認 uri
      })
      return forward(operation)
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


    return new ApolloClient({
      cache: new InMemoryCache({
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
        },
      }),
      link: ApolloLink.from([
        dynamicUriLink,
        middleware,
        ...(middlewares || []),
        httpLink,
      ])
    })

  })

  return {
    getClient
  }
}


const { getClient } = makeApolloClient()

export async function fetchGQL(query:TypedDocumentNode, args?:IFetchGQLArgs){
  const requestLang = headers().get('x-lang') || i18n.defaultLocale.shortCode
  const localeCode = convertLocaleCode(requestLang, 'long')
  const { variables = {}, context = {} } = args ?? {}
  const { contextHeaders = {} } = context

  try {
    const result = await getClient().query({
      query,
      context: { // 添加自定義 context 範例
        ...context,
        headers: {
          ...contextHeaders
          // "accept-language": localeCode
        }
      },
      variables: {
        ...variables,
        // for WPGraphQL 的 語言參數，如未使用 WPGraphQL 可以刪除
        language: requestLang.toUpperCase(),
        translation: requestLang.toUpperCase(),
      }
    })
    return result?.data

  } catch (error: any) {
    console.error(error)
    return error
  }
}