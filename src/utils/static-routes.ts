import cloneDeep from 'lodash.clonedeep'
import type { SitemapRouteDefaults, VueRouterRoute } from '../type'
import { excludeRoutes, normalizePath } from './helper'

export function getStaticRoutes({
  list,
  exclude,
  defaults,
}: {
  list: VueRouterRoute[]
  exclude: string[]
  defaults: SitemapRouteDefaults
}) {
  const clone = cloneDeep(list)
  const routes = getFlattenRoutes(clone)
  const sitemap = getSitemap({ routes, defaults, exclude })
  return sitemap
}

function getFlattenRoutes(router: VueRouterRoute[], parentPath = '', result: VueRouterRoute[] = []) {
  router.forEach((route) => {
    // skip dynamic routes
    if ([':', '*'].some(c => route.path.includes(c)))
      return

    if (route.children)
      return getFlattenRoutes(route.children, `${parentPath + route.path}/`, result)

    route.path = normalizePath(parentPath + route.path)
    result.push(route)
  })

  return result
}

function getSitemap({
  routes,
  defaults,
  exclude,
}: {
  routes: VueRouterRoute[]
  defaults: { changefreq: string; priority: number; lastmod: Date }
  exclude: string[]
}) {
  return excludeRoutes(
    exclude,
    routes.map((route) => {
      return {
        ...defaults,
        url: route.path,
      }
    }),
  )
}
