import nextra from "nextra";
import { remarkMermaid } from "@theguild/remark-mermaid";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withNextra = nextra({
    search: true,
    defaultShowCopyCode: true,
    mdxOptions: {
        remarkPlugins: [remarkMermaid],
    },
});

export default withNextra({
    // Webpack alias to replace @theguild/remark-mermaid/mermaid with our custom component
    webpack: (config) => {
        config.resolve.alias["@theguild/remark-mermaid/mermaid"] = path.resolve(
            __dirname,
            "components/mermaid.tsx"
        );
        return config;
    },
});

