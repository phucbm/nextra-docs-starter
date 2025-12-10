import {MetaRecord} from "nextra";

const DOCS_ITEMS: MetaRecord = {
    index: '',
    navigation: '',
    mermaid: '',
    tips: '',
}


export default {
    index: {
        type: 'page',
        theme: {
            layout: 'full',
            toc: false,
            timestamp: false,
        }
    },
    docs: {
        type: 'page',
        title: 'Documentation',
        items: DOCS_ITEMS
    },
    article: {
        type: 'page',
        theme: {
            toc: false,
            typesetting: 'article',
        }
    },
    contact: {
        type: 'page',
        theme: {
            layout: 'full',
            toc: false,
            timestamp: false,
        }
    },
    nextraStarter: {
        title: 'Starter Templates',
        type: 'menu',
        items: {
            docs: {
                title: 'Docs Starter repo',
                href: 'https://github.com/phucbm/nextra-docs-starter',
            },
            blog: {
                title: 'Blog Starter repo',
                href: 'https://github.com/phucbm/nextra-blog-starter'
            }
        }
    },
}