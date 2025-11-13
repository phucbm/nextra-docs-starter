export interface PageItem {
    title: string;
    url: string;
    name?: string;
    parent?: string;
    description?: string;
}

export async function getPagesFromPageMap({
                                              pageMapArray,
                                              parentTitle,
                                              filterItem,
                                          }: {
    pageMapArray: any[];
    parentTitle?: string;
    filterItem?: (item: PageItem) => PageItem | Promise<PageItem>;
}): Promise<PageItem[]> {
    const metaData = pageMapArray[0]?.data || {};
    const results: PageItem[] = [];

    for (const item of pageMapArray.slice(1)) {
        if (!item.route) continue;
        const itemMeta = metaData[item.name];
        if (itemMeta?.display === 'hidden') continue;
        if (item.display === 'hidden') continue;

        let itemValue: PageItem = {
            title: item.title,
            url: item.route,
            name: item.name,
            description: item.description,
            parent: parentTitle,
        };

        if (filterItem) {
            itemValue = await filterItem(itemValue);
        }

        results.push(itemValue);

        if (item.children && Array.isArray(item.children)) {
            const childPages = await getPagesFromPageMap({
                pageMapArray: item.children,
                parentTitle: itemValue.title,
                filterItem,
            });
            results.push(...childPages);
        }
    }

    return results;
}
