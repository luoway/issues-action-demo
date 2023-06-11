import { defineConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'

export default defineConfig({
    title: '页面标题',
    vite: {
        plugins: [
            pagefindPlugin(
                {
                    locales: {
                        root:{
                            btnPlaceholder: '搜索',
                            placeholder: '搜索文档',
                            emptyText: '没有内容',
                            heading: '共: {{searchResult}} 条结果',
                        },
                    },
                    customSearchQuery(input){
                        // 将搜索的每个中文单字两侧加上空格
                        return input.replace(/[\u4e00-\u9fa5]/g, ' $& ')
                            .replace(/\s+/g,' ')
                            .trim()
                    }
                },
            )
        ],
    },
    locales: {
        root: {
            lang: 'zh-cn',
            label: '简体中文'
        },
    },
    themeConfig: {
        outline: 'deep',
        outlineTitle: '导航',
        sidebar: [],
    },
})
