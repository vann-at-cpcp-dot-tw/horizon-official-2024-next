import { HttpLink } from "@apollo/client"
import { NextSSRInMemoryCache, NextSSRApolloClient} from "@apollo/experimental-nextjs-app-support/ssr"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc"
import { TypedDocumentNode } from "@graphql-typed-document-node/core"

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}graphql`
const revalidate = Number(process.env.NEXT_PUBLIC_REVALIDATE || 60)

interface TypeFetchQLArgs {
  variables?:{
    [key:string]: any
  }
  context?:{
    [key:string]: any
  }
}



export const { getClient } = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: API_URL,
    }),
  })
})

export const fetchGQL = async function(query:TypedDocumentNode, args?:TypeFetchQLArgs){
  const { variables, context } = args ?? { variables:{}, context:null }

  const result = await getClient().query({
    query,
    variables: variables ?variables :{},
    context: context
      ? {
        fetchOptions: {
          next: {
            revalidate
          },
        },
        ...context
      }
      : {
        fetchOptions: {
          next: {
            revalidate
          },
        },
      },
  })

  return result?.data
}