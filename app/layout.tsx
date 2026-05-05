import {Footer, Layout, Navbar} from 'nextra-theme-docs'
import {Head} from 'nextra/components'
import {getPageMap} from 'nextra/page-map'
import './globals.css'
import {Metadata} from "next";
import {NextraSearchDialog} from "@/components/nextra-search-dialog";
import {getPagesFromPageMap} from "@/lib/getPagesFromPageMap";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nextra.phucbm.com'
const siteTitle = 'Nextra Docs Starter'
const siteDescription = 'A clean, beginner-friendly Nextra starter template. Skip the confusing official docs — clone, deploy, and build your documentation site in minutes.'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        template: `%s | ${siteTitle}`,
        default: `${siteTitle} — Free Nextra Template by phucbm`,
    },
    description: siteDescription,
    keywords: ['nextra', 'nextra starter', 'nextra template', 'nextra boilerplate', 'nextra docs template', 'nextjs documentation', 'nextra example'],
    authors: [{name: 'phucbm', url: 'https://github.com/phucbm'}],
    creator: 'phucbm',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteUrl,
        siteName: siteTitle,
        title: `${siteTitle} — Free Nextra Template by phucbm`,
        description: siteDescription,
        images: [{url: '/og-image.png', width: 1200, height: 630, alt: siteTitle}],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${siteTitle} — Free Nextra Template by phucbm`,
        description: siteDescription,
        images: ['/og-image.png'],
        creator: '@phucbm',
    },
    alternates: {
        canonical: siteUrl,
    },
    robots: {
        index: true,
        follow: true,
    },
}

// const banner = <Banner storageKey="some-key">This template was created with 🩸 and 💦 by <Link href="https://github.com/phucbm">PHUCBM</Link> 🐧</Banner>
const navbar = (
    <Navbar
        projectLink="https://github.com/phucbm/nextra-docs-starter"
        logo={<img src="/images/general/logo.svg" alt="Logo" width={100} height={20}/>}
        // ... Your additional navbar options
    />
)
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra Docs Starter by <a href="https://github.com/phucbm" target="_blank" rel="noopener noreferrer">phucbm</a>.</Footer>

export default async function RootLayout({children}) {
    const pageMap = await getPageMap();
    const pages = await getPagesFromPageMap({
        pageMapArray: pageMap,
        // modify page data if needed
        // filterItem: async (item) => {
        //     return {
        //         ...item,
        //     };
        // }
    });


    return (
        <html
            // Not required, but good for SEO
            lang="en"
            // Required to be set
            dir="ltr"
            // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
            suppressHydrationWarning
        >
        <Head>
            <link rel="shortcut icon" href="/images/general/icon.svg"/>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        name: siteTitle,
                        description: siteDescription,
                        url: siteUrl,
                        applicationCategory: 'DeveloperApplication',
                        operatingSystem: 'Any',
                        author: {
                            '@type': 'Person',
                            name: 'phucbm',
                            url: 'https://github.com/phucbm',
                        },
                        offers: {
                            '@type': 'Offer',
                            price: '0',
                            priceCurrency: 'USD',
                        },
                    }),
                }}
            />
        </Head>
        <body>
        <Layout
            // banner={banner}
            navbar={navbar}
            pageMap={pageMap}
            docsRepositoryBase="https://github.com/phucbm/nextra-docs-starter/tree/main"
            footer={footer}
            search={<NextraSearchDialog pages={pages}/>}
            // ... Your additional layout options
        >
            {children}
        </Layout>
        </body>
        </html>
    )
}