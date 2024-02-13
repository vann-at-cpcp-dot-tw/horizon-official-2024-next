import { create } from 'zustand'
import { routes, TypeRouteNode } from '@src/routes'

interface TypeStore {
  isPageLoaded: boolean
  isLoadingScreenFadedOut: boolean
  headerHeight: number
  lightbox: string[]
  currentRoute: TypeRouteNode
  menu: TypeRouteNode[]
  common: {
    [key:string]: any,
  }
  [key:string]: any
}

const defaultStore = {
  isPageLoaded: false,
  isLoadingScreenFadedOut: false,
  headerHeight: 0,
  lightbox: [],
  currentRoute: {
    pathname: '',
  },
  menu: routes.filter((node)=>node?.meta?.menu),
  common: {},
}

export const useStore = create<TypeStore>((set, get)=>({
  ...defaultStore,
  set: (updateState={})=>{
    return set((state:TypeStore)=>{
      return {
        ...state,
        ...updateState
      }
    })
  },
  lightboxOpen: (actionId:string)=>{
    if( !actionId ){
      return null
    }
    return set((state:TypeStore)=>{
      return {
        lightbox: [...state.lightbox, actionId]
      }
    })
  },
  lightboxClose: (actionId:string)=>{
    if( !actionId ){
      return set((state:TypeStore)=>{
        return {
          lightbox: []
        }
      })
    }
    return set((state:TypeStore)=>{
      return {
        lightbox: state.lightbox?.filter((id:string)=>{
          return id !== actionId
        })
      }
    })
  }
  // increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 })
}))