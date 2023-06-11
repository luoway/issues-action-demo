import { defineConfig } from 'vitepress'

export default defineConfig({
    title: '页面标题',
    themeConfig: {
        outline: 'deep',
        outlineTitle: '导航',
        sidebar: [],
    },
    locales: {
        root: {
            lang: 'zh-cn',
            label: '简体中文'
        },
    },
})
