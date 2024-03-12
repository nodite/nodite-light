import { defineConfig } from 'vitepress'
import { en } from './en.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nodite Light",

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nodite/nodite-light' }
    ]
  },

  locales: {
    root: { label: 'English', ...en },
  }
})
