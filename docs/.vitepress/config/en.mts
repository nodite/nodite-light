import { DefaultTheme, defineConfig } from "vitepress";

export const en = defineConfig({
  lang: "en-US",

  description: "Simple, reliable, and excellent security.",

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/guide/': {base: '/guide/', items: sidebarGuide() }
    },

    editLink: {
      pattern: 'https://github.com/nodite/nodite-light/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Guide',
      link: '/guide/what-is-nodite-light',
      activeMatch: '/guide/'
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'What is Nodite Light?', link: 'what-is-nodite-light' },
        { text: 'Quickstart', link: 'quickstart' },
      ]
    },
  ]
}
