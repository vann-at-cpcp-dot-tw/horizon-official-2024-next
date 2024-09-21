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
          ZipDTO: {
            keyFields: ['id', 'name'],
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
  const headersList = headers()
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value || ''
  const { variables = {}, context = {} } = args ?? {}


  try {
    const result = await getClient().query({
      query,
      variables,
      context: {
        headers: {
          "accept-language": localeCode,
          // "Authorization": `Bearer ${ accessToken }`,
        }
      },
    })
    return result?.data

  } catch (error: any) {
    console.error(error)
    return error
  }
}