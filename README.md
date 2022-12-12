# 🗺️ Sitemap module for Nuxt 2

## Features
* Typescript support
* Allow to pass dynamic routes
* Sitemap cache
* Chunks splitting
* Exclude certain routes from the sitemap

## Installation
Install package via a package manager: 
```bash
# using npm
npm install @artmizu/sitemap-nuxt-2

# using yarm
yarn add @artmizu/sitemap-nuxt-2

# using pnpm
pnpm add @artmizu/sitemap-nuxt-2
```

Add it to a `modules` property of your nuxt config:
```js
export default {
  modules: ['@artmizu/sitemap-nuxt-2']
}
```

## Options
You can pass it through module options and the nuxt config property `sitemap`.

### request
- Type: `Promise<SitemapRoute[]>`
- Description: Pass a promise, which will be resolved with routes array

### cacheTime
- Type: `number`
- Default: `1000 * 60 * 60 * 24`

### chunkSize
- Type: `number`
- Default: `50000`

### exclude
- Type: `string[]`
- Default: `['/**/(*', '/**/*script']`

### trailingSlash
- Type: `boolean`
- Default: `false`

### defaults
- Type: 'object`
- Default: 
```
{
  changefreq: 'monthly',
  priority: 0.1,
  lastmod: new Date(),
}
```

### sitemapPath
- Type: `string`
- Default: `path.resolve(tmpdir())`

### staticSitemapPath
- Type: `string`
- Default: `path.resolve(tmpdir(), './sitemap-routes.json')`

### onError
- Type: `function`

### beforeGenerate
- Type: `function`

### afterGenerate
- Type: `function`
- Description: From the callback params you can get the sitemap generation time

