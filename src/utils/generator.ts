import { Readable } from 'stream'
import fs, { createWriteStream } from 'fs'
import { resolve } from 'path'
import { SitemapAndIndexStream, SitemapStream } from 'sitemap'
import type { SitemapModuleParams, SitemapRoute } from '../type'
import { getDynamicRoutes } from './dynamic-routes'

export async function generateSitemap(params: SitemapModuleParams) {
  try {
    const dynamicRoutes = (await getDynamicRoutes(params)) || []
    const staticRoutes: SitemapRoute[] = readJsonFile(params.staticSitemapPath)
    const stream = new SitemapAndIndexStream({
      limit: params.chunkSize,
      getSitemapStream: (i) => {
        const sitemapStream = new SitemapStream({ hostname: params.hostname })
        const path = `./sitemap-${i}.xml${params.trailingSlash ? '/' : ''}`
        const ws = sitemapStream
          .pipe(createWriteStream(resolve(params.sitemapPath, path)))
        return [{
          url: new URL(path, params.hostname).toString(),
          lastmod: new Date().toISOString(),
        }, sitemapStream, ws]
      },
    })

    Readable.from([...dynamicRoutes, ...staticRoutes]).pipe(stream).pipe(createWriteStream(resolve(params.sitemapPath, './sitemap-index.xml')))
  }
  catch (e) {
    params.onError(e)
  }
}

function readJsonFile(path: string) {
  const file = fs.readFileSync(path, {
    encoding: 'utf8',
  })
  return JSON.parse(file)
}
