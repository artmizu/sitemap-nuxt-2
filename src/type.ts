export interface VueRouterRoute {
  path: string
  children: VueRouterRoute[]
}

export interface SitemapRouteDefaults {
  changefreq: string
  priority: number
  lastmod: Date
}

export interface SitemapRoute extends SitemapRouteDefaults {
  url: string
}

export type SitemapRequest = () => Promise<Partial<SitemapRoute>[]>

export interface SitemapModuleParams {
  hostname: string
  cacheTime: number
  chunkSize: number
  exclude: string[]
  defaults: SitemapRouteDefaults
  sitemapPath: string
  staticSitemapPath: string
  request: SitemapRequest
  onError: (e: unknown) => void
  beforeGenerate: () => void
  afterGenerate: ({ time }: { time: number }) => void
}
