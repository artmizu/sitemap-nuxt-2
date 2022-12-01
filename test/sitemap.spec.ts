import path from 'path'
import { get, setupTest } from '@nuxt/test-utils'
import { XMLParser } from 'fast-xml-parser'

describe('sitemap check', () => {
  const parser = new XMLParser()

  setupTest({
    rootDir: path.resolve(__dirname, '../playground/'),
    browser: false,
    server: true,
    config: {
      sitemap: {
        hostname: 'https://artmizu.ru',
        trailingSlash: false,
        chunkSize: 10,
        defaults: {
          priority: 0.2,
        },
        request() {
          return Promise.resolve(new Array(50).fill(null).map((_, index) => {
            return {
              url: `https://artmizu.ru/custom-${index}`,
              changefreq: 'daily',
            }
          }))
        },
      },
    },
  })

  test('check index page', async () => {
    const page = await get('/sitemap-index.xml')
    const data = parser.parse(page.body as string)
    expect(data).toMatchObject({
      sitemapindex: {
        sitemap: [
          {
            loc: 'https://artmizu.ru/sitemap-0.xml',
          },
          {
            loc: 'https://artmizu.ru/sitemap-1.xml',
          },
          {
            loc: 'https://artmizu.ru/sitemap-2.xml',
          },
          {
            loc: 'https://artmizu.ru/sitemap-3.xml',
          },
          {
            loc: 'https://artmizu.ru/sitemap-4.xml',
          },
          {
            loc: 'https://artmizu.ru/sitemap-5.xml',
          },
        ],
      },
    })
  })

  test('check first inner page', async () => {
    const page = await get('/sitemap-0.xml')
    const data = parser.parse(page.body as string)
    expect(data.urlset.url).toMatchObject([
      {
        loc: 'https://artmizu.ru/custom-0/',
        changefreq: 'daily',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/custom-1/',
        changefreq: 'daily',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/custom-2/',
        changefreq: 'daily',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/custom-3/',
        changefreq: 'daily',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/custom-4/',
        changefreq: 'daily',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/custom-5/',
        changefreq: 'daily',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/custom-6/',
        changefreq: 'daily',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/custom-7/',
        changefreq: 'daily',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/custom-8/',
        changefreq: 'daily',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/custom-9/',
        changefreq: 'daily',
        priority: 0.2,
      },
    ])
  })

  test('check last inner page', async () => {
    const page = await get('/sitemap-5.xml')
    const data = parser.parse(page.body as string)
    expect(data.urlset.url).toMatchObject([
      {
        loc: 'https://artmizu.ru/a/',
        changefreq: 'monthly',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/b/',
        changefreq: 'monthly',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/b/c/',
        changefreq: 'monthly',
        priority: 0.2,
      },
      {
        loc: 'https://artmizu.ru/',
        changefreq: 'monthly',
        priority: 0.2,
      },
    ])
  })
})
