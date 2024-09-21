import { ApolloLink } from "@apollo/client"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE
export const REVALIDATE = Number(process.env.NEXT_PUBLIC_REVALIDATE || 60)
export const FETCH_URI = `${API_BASE}graphql`

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