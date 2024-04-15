
import { createStore } from 'vanns-common-modules/dist/store'

const defaultStore = {
  isPageLoaded: false,
  isLoadingScreenFadedOut: false,
  headerHeight: 0,
  lightbox: [],
  currentRoute: {
    pathname: '',
  },
  common: {},
}
export const { useStore } = createStore(defaultStore)



