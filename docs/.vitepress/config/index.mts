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

  ignoreDeadLinks: [
    // ignore exact url "/playground"
    '/playground',
    // ignore all localhost links
    /^https?:\/\/localhost/,
    // ignore all links include "/repl/""
    /\/repl\//,
    // ignore all links start with "./"
    /^\.\//,
    // custom function, ignore all links include "ignore"
    (url) => {
      return url.toLowerCase().includes('ignore')
    }
  ],

  locales: {
    root: { label: 'English', ...en },
  }
})
