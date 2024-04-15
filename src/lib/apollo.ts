const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}graphql`
const REVALIDATE = Number(process.env.NEXT_PUBLIC_REVALIDATE || 60)

import { IFetchGQLArgs } from "vanns-common-modules/dist/lib/next/apollo"
import { makeApolloClient, makeFetcher } from "vanns-common-modules/dist/lib/next/apollo/server"
import { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { i18n } from "~~/i18n.config"
import { tools as langTools } from "vanns-common-modules/dist/use/next/useLangGuard"

const { convertLocaleCode } = langTools(i18n)

const { getClient } = makeApolloClient({
  uri: API_URL,
  revalidate: REVALIDATE
  // memoryCacheOptions: {
  //   typePolicies: {
  //     myElementNode: {
  //       keyFields: ['id', 'name'],
  //     },
  //   },
  // },
})

const fetchGQLWrapper = makeFetcher(getClient)

export async function fetchGQL(query:TypedDocumentNode, args?:IFetchGQLArgs){
  const { context, ...restArgs } = args ?? {}
  const headers = context?.headers || {}
  // const localeCode = convertLocaleCode(lang, 'long')
  return await fetchGQLWrapper(query, {
    ...restArgs,
    context: {
      ...(context || {}),
      headers: {
        ...headers
        // "accept-language": localeCode
      }
    }
  })
}