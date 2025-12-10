"use client";

// This file is used to alias @theguild/remark-mermaid/mermaid
// so that our custom MermaidDiagram component is used instead

import { MermaidDiagram } from "./mermaid-diagram";

// Export as Mermaid to match what remarkMermaid expects
export { MermaidDiagram as Mermaid };
