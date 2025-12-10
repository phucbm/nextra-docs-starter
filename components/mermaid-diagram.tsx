"use client";

import React, { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface MermaidDiagramProps {
  chart: string;
}

// Global flag to ensure mermaid is only initialized once
let mermaidInitialized = false;

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dialogContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: true,
        theme: "base",
        themeVariables: {
          primaryColor: "#ffffff",
          primaryTextColor: "#333333",
          primaryBorderColor: "#666666",
          lineColor: "#666666",
          secondaryColor: "#f5f5f5",
          tertiaryColor: "#ffffff",
          background: "#ffffff",
          mainBkg: "#ffffff",
          secondBkg: "#f5f5f5",
          tertiaryBkg: "#ffffff",
          edgeLabelBackground: "#ffffff",
          clusterBkg: "#f5f5f5",
          clusterBorder: "#666666",
          noteBkgColor: "#ffffff",
          noteBorderColor: "#666666",
        },
        securityLevel: "loose",
        // 텍스트 잘림 방지
        maxTextSize: 99999,
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          wrappingWidth: 300,
        },
        er: {
          useMaxWidth: false,
        },
        sequence: {
          useMaxWidth: false,
        },
      });
      mermaidInitialized = true;
    }
  }, []);

  useEffect(() => {
    if (!chart) return;

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        // Convert escaped newlines back to actual newlines (Nextra escapes them)
        // Decode HTML entities like &lt;br/&gt; back to <br/>
        // Then remove <br/> tags as mermaid renders them as text
        const chartContent = chart
          .replaceAll("\\n", "\n")
          .replaceAll(/&lt;/g, "<")
          .replaceAll(/&gt;/g, ">")
          .replaceAll(/&amp;/g, "&")
          .replaceAll(/<br\s*\/?>/gi, "\n");
        const { svg } = await mermaid.render(id, chartContent);
        setSvgContent(svg);
      } catch (error) {
        // console.error("Mermaid rendering error:", error);
      }
    };

    renderDiagram();
  }, [chart]);

  // 줌 인/아웃
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  // 패닝
  const handlePan = (direction: "up" | "down" | "left" | "right") => {
    const step = 50;
    setPosition((prev) => {
      switch (direction) {
        case "up":
          return { ...prev, y: prev.y + step };
        case "down":
          return { ...prev, y: prev.y - step };
        case "left":
          return { ...prev, x: prev.x + step };
        case "right":
          return { ...prev, x: prev.x - step };
        default:
          return prev;
      }
    });
  };

  // 리셋
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // 마우스 휠 줌 (Window 레벨에서 capture phase로 이벤트 캡처)
  useEffect(() => {
    if (!open) return;

    const handleWheel = (e: WheelEvent) => {
      const dialogElement = dialogContainerRef.current;

      // console.log('🎯 Window wheel event detected, deltaY:', e.deltaY);
      // console.log('📦 Dialog element exists:', !!dialogElement);
      // console.log('🎨 Event target:', e.target);

      // Dialog 내부에서 발생한 이벤트인지 확인
      if (dialogElement && e.target instanceof Node && dialogElement.contains(e.target)) {
        // console.log('✅ Inside dialog - applying zoom');
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale((prev) => {
          const newScale = Math.min(Math.max(prev + delta, 0.5), 3);
          // console.log('📏 Scale changing:', prev, '->', newScale);
          return newScale;
        });
      } else {
        // console.log('❌ Outside dialog - ignoring');
      }
    };

    // console.log('🚀 Adding window wheel listener with capture phase');
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });

    return () => {
      // console.log('🧹 Removing window wheel listener');
      window.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, [open]);

  // 마우스 드래그
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!open) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !open) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 키보드 단축키
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          handlePan("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          handlePan("down");
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlePan("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          handlePan("right");
          break;
        case "+":
        case "=":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
          e.preventDefault();
          handleZoomOut();
          break;
        case "0":
          e.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isDragging]);

  // Dialog 열릴 때 상태 리셋
  useEffect(() => {
    if (open) {
      handleReset();
    }
  }, [open]);

  return (
    <>
      {/* 일반 뷰 */}
      <div className="relative my-4 border rounded-lg p-4 bg-white dark:bg-gray-900">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="absolute top-2 right-2 p-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
              title="크게 보기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </DialogTrigger>

          {/* Dialog 전체화면 뷰 */}
          <DialogContent
            className="max-w-[95vw] w-[95vw] h-[90vh] p-0 overflow-hidden"
            showCloseButton={true}
          >
            <VisuallyHidden.Root>
              <DialogTitle>Mermaid Diagram</DialogTitle>
            </VisuallyHidden.Root>
            <div
              ref={dialogContainerRef}
              className="w-full h-full overflow-hidden bg-white dark:bg-gray-950"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                position: "relative",
              }}
            >
              {/* SVG 컨테이너 */}
              <div
                className="min-w-full min-h-full flex items-center justify-center p-8"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center",
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />

              {/* 컨트롤 패널 */}
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-50">
                {/* 줌 레벨 표시 */}
                <div className="bg-gray-800/90 dark:bg-gray-900/90 rounded-lg px-4 py-2 text-white text-sm font-mono text-center backdrop-blur-sm shadow-lg">
                  {Math.round(scale * 100)}%
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 일반 뷰 SVG */}
        <div
          className="flex justify-center items-center overflow-auto"
          style={{ minHeight: "200px" }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        <style jsx>{`
          div :global(svg) {
            max-width: 100%;
            height: auto;
            overflow: visible;
          }
          div :global(.nodeLabel) {
            white-space: normal !important;
            word-wrap: break-word !important;
          }
          div :global(.label) {
            overflow: visible !important;
          }
          div :global(foreignObject) {
            overflow: visible !important;
          }
        `}</style>
      </div>
    </>
  );
}
