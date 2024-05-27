const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}graphql`
const REVALIDATE = Number(process.env.NEXT_PUBLIC_REVALIDATE || 60)

import { headers } from 'next/headers'
import { IFetchGQLArgs } from "vanns-common-modules/dist/lib/next/apollo"
import { makeApolloClient, makeFetcher } from "vanns-common-modules/dist/lib/next/apollo/server"
import { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { i18n } from "~~/i18n.config"
import { tools as langTools } from "vanns-common-modules/dist/use/next/useLangGuard"

const { convertLocaleCode } = langTools(i18n)

const { getClient } = makeApolloClient({
  uri: API_URL,
  revalidate: REVALIDATE,
  memoryCacheOptions: {
    typePolicies: {
      Yacht: {
        merge: true,
        // merge(existing:any, incoming:any) {
        //   return { ...existing, ...incoming }
        // }
      },
    },
  },
})

const fetchGQLWrapper = makeFetcher(getClient)

export async function fetchGQL(query:TypedDocumentNode, args?:IFetchGQLArgs){
  const { context, ...restArgs } = args ?? {}
  const contextHeaders = context?.headers || {}
  const requestLang = headers().get('x-lang') || i18n.defaultLocale.shortCode
  // const localeCode = convertLocaleCode(lang, 'long')
  return await fetchGQLWrapper(query, {
    ...restArgs,
    context: {
      ...(context || {}),
      headers: {
        ...contextHeaders
        // "accept-language": localeCode
      }
    },
    variables: {
      ...(args?.variables || {}),
      language: requestLang.toUpperCase(),
      translation: requestLang.toUpperCase(),
    }
  })
}