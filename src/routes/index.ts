export interface TypeRouteNode {
  pathname: string
  meta?: {
    [key:string]: string | number | boolean | null,
  }
  children?: TypeRouteNode[]
};

const routes:TypeRouteNode[] = [
  {
    pathname: '/',
    meta: {
      title: 'Next 13 Site',
      menu: false,
    },
  },
  {
    pathname: '/about/',
    meta: {
      title: 'Next 13 Site - About',
      menu: true,
      menu_label: 'ABOUT ME',
    },
  },
  {
    pathname: '/contact/',
    meta: {
      title: 'Next 13 Site - Contact',
      menu: true,
      menu_label: 'CONTACT',
    },
  },
]

const menu:TypeRouteNode[] = routes.filter((node)=>{
  return node?.meta?.menu
})

export {
  routes,
  menu,
}