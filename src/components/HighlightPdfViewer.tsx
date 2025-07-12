
import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useRef, useState } from "react";

// Use worker that matches the pdfjs version used by react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  file: string;
  highlight: string;
}

export default function HighlightedPdfViewer({ file, highlight }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const highlightPdfText = () => {
      const container = containerRef.current;
      if (!container) return;

      // Clear previous highlights by removing <mark> tags
      const marks = container.querySelectorAll("mark");
      marks.forEach((mark) => {
        const parent = mark.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
          parent.normalize();
        }
      });

      if (!highlight) return;

      const textSpans = Array.from(container.querySelectorAll("span"));
      if (textSpans.length === 0) return;

      const fullText = textSpans.map((s) => s.textContent || "").join("");
      const highlightLower = highlight.toLowerCase();
      const fullTextLower = fullText.toLowerCase();

      let firstMatchElement: HTMLElement | null = null;
      let startIndex = 0;

      while (startIndex < fullTextLower.length) {
        const matchIndex = fullTextLower.indexOf(highlightLower, startIndex);
        if (matchIndex === -1) break;

        const matchEndIndex = matchIndex + highlight.length;
        let charIndex = 0;
        let spansToWrap = [];
        let firstSpan = -1, lastSpan = -1;

        for (let i = 0; i < textSpans.length; i++) {
          const spanTextLength = (textSpans[i].textContent || "").length;
          if (charIndex + spanTextLength > matchIndex && firstSpan === -1) {
            firstSpan = i;
          }
          if (charIndex + spanTextLength >= matchEndIndex && lastSpan === -1) {
            lastSpan = i;
          }
          charIndex += spanTextLength;
        }
        
        if (firstSpan !== -1 && lastSpan !== -1) {
            for(let i = firstSpan; i <= lastSpan; i++) {
                spansToWrap.push(textSpans[i]);
            }
        }

        if (spansToWrap.length > 0) {
          const range = document.createRange();
          const first = spansToWrap[0];
          const last = spansToWrap[spansToWrap.length - 1];
          
          const startText = first.textContent || "";
          const endText = last.textContent || "";

          let startOffset = 0;
          let endOffset = endText.length;
          
          let cumulativeLength = 0;
          for(let i=0; i<firstSpan; i++) {
            cumulativeLength += (textSpans[i].textContent || "").length;
          }
          startOffset = matchIndex - cumulativeLength;

          const mark = document.createElement("mark");
          mark.style.backgroundColor = "#ffeb3b";
          mark.style.borderRadius = "3px";
          
          try {
            range.setStart(first.firstChild || first, startOffset);
            range.setEnd(last.firstChild || last, endOffset);
            range.surroundContents(mark);

            if (!firstMatchElement) {
                firstMatchElement = mark;
            }
          } catch (e) {
            console.error("Failed to create highlight range:", e);
          }
        }
        startIndex = matchEndIndex;
      }

      if (firstMatchElement) {
        firstMatchElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    const timeoutId = setTimeout(highlightPdfText, 2000);
    return () => clearTimeout(timeoutId);
  }, [highlight, numPages]);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div ref={containerRef} className="overflow-y-auto max-h-screen border bg-gray-50">
      <Document file={file} onLoadSuccess={onLoadSuccess}>
        {Array.from(new Array(numPages), (_, index) => (
          <div key={`page_${index + 1}`} className="mb-6 flex justify-center">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Page
                pageNumber={index + 1}
                width={800}
                renderTextLayer={true}
                renderAnnotationLayer={false}
              />
              <div className="bg-gray-50 px-3 py-2 text-center text-sm text-gray-600 border-t">
                Page {index + 1} of {numPages}
              </div>
            </div>
          </div>
        ))}
      </Document>
    </div>
  );
}
