"use client"
import { ReactNode, createContext } from 'react'

interface TypeContext {
  [key: string]: any
}
export const LocalDataContext = createContext<TypeContext>({})

export default function PublicationRootDataProviders({
  children,
  data,
}:{
  children:ReactNode,
  data: {
    [key: string]: any
  }
}) {
  return <LocalDataContext.Provider value={data}>
    { children }
  </LocalDataContext.Provider>
}