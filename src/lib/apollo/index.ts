import { ApolloLink } from "@apollo/client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
export const REVALIDATE = Number(process.env.NEXT_PUBLIC_REVALIDATE || 60)
export const FETCH_URI = `${API_URL}/graphql`

export interface IFetchGQLArgs {
  variables?: {
    [key:string]: any;
  }
  context?:{
    [key:string]: any;
  }
}

export interface IMakeApolloClient {
  middlewares?: ApolloLink[];
}