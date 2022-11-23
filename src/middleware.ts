import fs from 'fs'
import consola from 'consola'
import type { ServerMiddleware } from '@nuxt/types'
import type { SitemapModuleParams } from './type'
import { generateSitemap } from './utils/generator'

let lastTimeGenerate: number

export default function (params: SitemapModuleParams) {
  const getSitemapMiddleware: ServerMiddleware = async function (req, res, next) {
    const url = req.url?.endsWith('/') ? req.url.slice(0, -1) : req.url
    if (!url) {
      next()
      return
    }

    const list = url.split('/')
    const fileName = list[list.length - 1]
    const isSitemapRequest = fileName.includes('sitemap') && fileName.includes('.xml')

    if (isSitemapRequest) {
      consola.info(`[sitemap] current cache time expire is ${lastTimeGenerate}`)
      try {
        const isCacheStale = lastTimeGenerate + params.cacheTime < Date.now()
        if (!lastTimeGenerate || isCacheStale) {
          consola.info('[sitemap] Generation begin')
          params.beforeGenerate?.()
          const time = Date.now()
          await generateSitemap(params)
          consola.success('[sitemap] Generation completed')
          params.afterGenerate?.({ time: Date.now() - time })
          lastTimeGenerate = Date.now()
        }

        const isFileExist = fs.existsSync(`${params.sitemapPath}/${fileName}`)
        if (isFileExist) {
          res.setHeader('Content-Type', 'application/xml')
          fs.createReadStream(`${params.sitemapPath}/${fileName}`).pipe(res)
        }
        else {
          next()
        }
      }
      catch (e) {
        params.onError(e)
      }
    }
    else {
      next()
    }
  }

  return getSitemapMiddleware
}
