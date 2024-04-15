"use client"

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}graphql`

import { makeApolloClient, ApolloClientProvider } from "vanns-common-modules/dist/lib/next/apollo/client"
import { i18n } from "~~/i18n.config"
import { useLangGuard } from "vanns-common-modules/dist/use/next/useLangGuard"

export default function ApolloProvider({
  children
}:{
  children: React.ReactNode,
}){
  const { localeCode } = useLangGuard(i18n)

  return <ApolloClientProvider makeClient={()=>{
    const { getClient } = makeApolloClient({
      uri: API_URL,
      // context: {
      //   headers: {
      //     "accept-language": localeCode
      //   }
      // },
      // memoryCacheOptions: {
      //   typePolicies: {
      //     myElementNode: {
      //       keyFields: ['id', 'name'],
      //     },
      //   },
      // },
    })
    return getClient()
  }}>
    { children }
  </ApolloClientProvider>
}