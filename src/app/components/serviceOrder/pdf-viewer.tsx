"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PdfStatus } from "./pdf-status";

// Servido de /public (copiado no postinstall): o minificador do Next 14 quebra ao empacotar o worker .mjs
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfViewerProps {
  file: Blob;
}

// Renderiza as páginas em canvas (pdf.js), igual em desktop, iOS e Android
export default function PdfViewer({ file }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {!width && <PdfStatus />}
      {width && (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<PdfStatus />}
          error={<PdfStatus message="Não foi possível exibir o PDF." />}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={width}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="mb-4 overflow-hidden rounded-md shadow-md last:mb-0"
            />
          ))}
        </Document>
      )}
    </div>
  );
}
