import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import consola from 'consola'
import type { Module } from '@nuxt/types'
import merge from 'lodash.merge'
import getSitemapMiddleware from './middleware'
import { getStaticRoutes } from './utils/static-routes'
import type { SitemapModuleParams, SitemapRoute, VueRouterRoute } from './type'

const SitemapModule: Module = function (moduleOptions: Partial<SitemapModuleParams>) {
  if (this.options.dev && process.env.NODE_ENV !== 'production')
    return consola.info('[sitemap] Generation disabled')

  const option: SitemapModuleParams = merge(
    {
      cacheTime: 1000 * 60 * 60 * 24,
      chunkSize: 50000,
      exclude: ['/**/(*', '/**/*script'],
      defaults: {
        changefreq: 'monthly',
        priority: 0.1,
        lastmod: new Date(),
      },
      sitemapPath: path.resolve(tmpdir()),
      staticSitemapPath: path.resolve(tmpdir(), './sitemap-routes.json'),
      request: () => Promise.resolve<Partial<SitemapRoute>[]>([]),
      onError: (e: unknown) => {
        consola.error('[sitemap] Error', e)
      },
      beforeGenerate: () => { },
      afterGenerate: () => { },
    },
    this.options.sitemap,
    moduleOptions,
  )

  if (!option.hostname)
    consola.error('[sitemap] please specify hostname')

  this.addServerMiddleware(getSitemapMiddleware(option))

  this.extendRoutes((routes: VueRouterRoute[]) => {
    const staticSitemap = getStaticRoutes({
      list: routes,
      exclude: option.exclude,
      defaults: option.defaults,
    })

    fs.promises.writeFile(option.staticSitemapPath, JSON.stringify(staticSitemap))
    consola.success('[sitemap] File with static routes is generated')
  })
}

export default SitemapModule

declare module '@nuxt/types' {
  interface NuxtConfig {
    sitemap?: DeepPartial<SitemapModuleParams>
  }
}

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T
