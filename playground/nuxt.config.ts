import type { NuxtConfig } from '@nuxt/types'
import MyModule from '../'

const config: NuxtConfig = {
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    MyModule,
  ],

  sitemap: {
    hostname: 'https://05.ru/',
    request() {
      return Promise.resolve([
        {
          url: 'https://05.ru/custom-1',
          changefreq: 'daily',
        },
        {
          url: 'https://05.ru/custom-2',
          changefreq: 'hourly',
        },
      ])
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
}

export default config
