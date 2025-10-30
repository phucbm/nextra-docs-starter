import type {MetadataRoute} from 'next'
import {Folder, MdxFile, Meta, MetaJsonFile, PageMapItem} from 'nextra'
import {getPageMap} from 'nextra/page-map'

export const dynamic = 'force-static'

interface SitemapEntry {
    url: string
    lastModified: string
}

const isMetaJsonFile = (value: unknown): value is MetaJsonFile =>
    typeof value === 'object' && value !== null && 'data' in value

const isFolder = (value: unknown): value is Folder =>
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'route' in value &&
    'children' in value

const isMdxFile = (value: unknown): value is MdxFile =>
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'route' in value &&
    'frontMatter' in value

// Check if a page should be hidden based on meta
const isPageHidden = (name: string, metaData: Record<string, Meta>): boolean => {
    const metaEntry = metaData[name]

    // Check specific entry first
    if (typeof metaEntry === 'object' && metaEntry !== null && 'display' in metaEntry) {
        return metaEntry.display === 'hidden'
    }

    // Check wildcard '*' fallback
    const wildcardEntry = metaData['*']
    if (typeof wildcardEntry === 'object' && wildcardEntry !== null && 'display' in wildcardEntry) {
        return wildcardEntry.display === 'hidden'
    }

    return false
}

const toSitemapEntry = (pageMapEntry: PageMapItem, metaData: Record<string, Meta> = {}): SitemapEntry[] => {
    if (isFolder(pageMapEntry)) {
        // Check if folder should be hidden
        if (isPageHidden(pageMapEntry.name, metaData)) {
            return []
        }
        return parsePageMapItems(pageMapEntry.children)
    } else if (isMdxFile(pageMapEntry)) {
        // Check if page should be hidden
        if (isPageHidden(pageMapEntry.name, metaData)) {
            return []
        }

        const {frontMatter, route} = pageMapEntry

        return [{
            url: route,
            lastModified: frontMatter?.timestamp
                ? new Date(frontMatter.timestamp).toISOString()
                : new Date().toISOString(),
        }]
    }

    return []
}

const parsePageMapItems = (items: PageMapItem[]): SitemapEntry[] => {
    // Get metadata if it exists
    const metaFile = items.find((item) => isMetaJsonFile(item))
    const metaData = (metaFile as MetaJsonFile | undefined)?.data ?? {}

    // Process ALL items (not just those in meta)
    const sitemapEntries: SitemapEntry[] = items
        .filter((item) => !isMetaJsonFile(item)) // Skip meta files themselves
        .flatMap(pageMapEntry => toSitemapEntry(pageMapEntry, metaData))

    return sitemapEntries
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'
    const pageMap = await getPageMap()

    const entries = parsePageMapItems(pageMap)

    return entries.map((entry) => ({
        url: `${baseUrl}${entry.url}`,
        lastModified: entry.lastModified,
        changeFrequency: 'weekly' as const,
        priority: entry.url === '/' ? 1 : 0.8,
    }))
}