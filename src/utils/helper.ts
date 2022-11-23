import { Minimatch } from 'minimatch'
import type { SitemapRoute } from '../type'

export function excludeRoutes(patterns: string[], routes: SitemapRoute[]) {
  patterns.forEach((pattern) => {
    const minimatch = new Minimatch(pattern)
    minimatch.negate = true
    routes = routes.filter(({ url }) => minimatch.match(url))
  })
  return routes
}

export function normalizePath(path: string, { trailingSlash = true }: { trailingSlash?: boolean } = {}) {
  const tmp = path
  if (tmp.length === 0) {
    return '/'
  }
  else if (trailingSlash) {
    const isTrailingSlash = tmp.charAt(tmp.length - 1) === '/'
    return isTrailingSlash ? tmp : `${tmp}/`
  }
  else {
    return tmp
  }
}
