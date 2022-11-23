import { Readable } from 'stream'
import fs from 'fs'
import { simpleSitemapAndIndex } from 'sitemap'
import type { SitemapModuleParams, SitemapRoute } from '../type'
import { getDynamicRoutes } from './dynamic-routes'

export async function generateSitemap(params: SitemapModuleParams) {
  try {
    const dynamicRoutes = (await getDynamicRoutes(params)) || []
    const staticRoutes: SitemapRoute[] = readJsonFile(params.staticSitemapPath)
    await simpleSitemapAndIndex({
      limit: params.chunkSize,
      hostname: params.hostname,
      destinationDir: params.sitemapPath,
      gzip: false,
      sourceData: Readable.from([...dynamicRoutes, ...staticRoutes]),
    })
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
