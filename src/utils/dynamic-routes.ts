import type { SitemapModuleParams } from '../type'
import { excludeRoutes, normalizePath } from './helper'

export async function getDynamicRoutes({ request, onError, exclude, defaults }: SitemapModuleParams) {
  try {
    const list = await request()
    const filtered = excludeRoutes(
      exclude,
      list.map((route) => {
        return {
          ...defaults,
          ...route,
          url: normalizePath(route.url || '/'),
        }
      }),
    )
    return filtered
  }
  catch (e) {
    onError(e)
  }
}
