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

      // Clear existing highlights
      const marks = container.querySelectorAll("mark");
      marks.forEach((mark) => {
        const parent = mark.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
          parent.normalize();
        }
      });

      if (!highlight.trim()) return;

      console.log('Starting highlight process for:', highlight);

      const result = findAndHighlightExact(container, highlight.trim());

      console.log('Highlight result:', result);

      if (result.firstMatch) {
        setTimeout(() => {
          result.firstMatch?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    };

    const findAndHighlightExact = (container: HTMLElement, searchText: string) => {
      const textSpans = Array.from(container.querySelectorAll("span"));
      console.log('Found spans:', textSpans.length);

      // Get all text with span mapping
      const textParts: { text: string; span: HTMLElement; spanIndex: number }[] = [];
      textSpans.forEach((span, index) => {
        const text = span.textContent || "";
        if (text.trim()) {
          textParts.push({ text, span, spanIndex: index });
        }
      });

      const fullText = textParts.map(part => part.text).join(' ');
      console.log('Full text length:', fullText.length);
      console.log('Searching for:', searchText);

      // Find matches using multiple strategies
      const matches = findMatches(fullText, searchText);
      console.log('Found matches:', matches.length);

      // Highlight the matches
      let firstMatchElement: HTMLElement | null = null;

      matches.forEach((match) => {
        const highlightElement = highlightTextRange(textParts, match.start, match.end, fullText);
        if (highlightElement && !firstMatchElement) {
          firstMatchElement = highlightElement;
        }
      });

      return { firstMatch: firstMatchElement, matchCount: matches.length };
    };

    const findMatches = (text: string, searchText: string) => {
      const matches: { start: number; end: number }[] = [];

      // Strategy 1: Exact case-sensitive match
      let index = text.indexOf(searchText);
      while (index !== -1) {
        matches.push({ start: index, end: index + searchText.length });
        index = text.indexOf(searchText, index + 1);
      }

      // Strategy 2: Case-insensitive match
      if (matches.length === 0) {
        const lowerText = text.toLowerCase();
        const lowerSearch = searchText.toLowerCase();

        index = lowerText.indexOf(lowerSearch);
        while (index !== -1) {
          matches.push({ start: index, end: index + searchText.length });
          index = lowerText.indexOf(lowerSearch, index + 1);
        }
      }

      // Strategy 3: Fuzzy matching - handle extra spaces and line breaks
      if (matches.length === 0) {
        const normalizedText = text.replace(/\s+/g, ' ').trim();
        const normalizedSearch = searchText.replace(/\s+/g, ' ').trim();

        const lowerNormalizedText = normalizedText.toLowerCase();
        const lowerNormalizedSearch = normalizedSearch.toLowerCase();

        index = lowerNormalizedText.indexOf(lowerNormalizedSearch);
        if (index !== -1) {
          // Map back to original text positions
          const originalStart = mapNormalizedToOriginal(text, normalizedText, index);
          const originalEnd = mapNormalizedToOriginal(text, normalizedText, index + normalizedSearch.length);

          if (originalStart !== -1 && originalEnd !== -1) {
            matches.push({ start: originalStart, end: originalEnd });
          }
        }
      }

      // Strategy 4: Word-by-word matching for very fuzzy cases
      if (matches.length === 0) {
        const words = searchText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const wordMatches = findWordSequence(text, words);
        matches.push(...wordMatches);
      }

      return matches;
    };

    const mapNormalizedToOriginal = (originalText: string, normalizedText: string, normalizedIndex: number) => {
      let originalIndex = 0;
      let normalizedCount = 0;

      for (let i = 0; i < originalText.length; i++) {
        const char = originalText[i];

        if (normalizedCount === normalizedIndex) {
          return originalIndex;
        }

        if (char.match(/\s/)) {
          // Skip multiple spaces in original, count as one in normalized
          if (normalizedCount < normalizedText.length && normalizedText[normalizedCount] === ' ') {
            normalizedCount++;
          }
          // Skip extra spaces in original
          while (i + 1 < originalText.length && originalText[i + 1].match(/\s/)) {
            i++;
          }
        } else {
          normalizedCount++;
        }

        originalIndex = i + 1;
      }

      return normalizedCount === normalizedIndex ? originalIndex : -1;
    };

    const findWordSequence = (text: string, words: string[]) => {
      const matches: { start: number; end: number }[] = [];
      const lowerText = text.toLowerCase();

      if (words.length === 0) return matches;

      // Find first word
      let searchStart = 0;
      while (true) {
        const firstWordIndex = lowerText.indexOf(words[0], searchStart);
        if (firstWordIndex === -1) break;

        // Try to find subsequent words within reasonable distance
        let currentPos = firstWordIndex;
        let matchEnd = firstWordIndex + words[0].length;
        let wordsMatched = 1;

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const maxDistance = 100; // Maximum characters between words
          const searchEnd = Math.min(currentPos + maxDistance, lowerText.length);
          const wordIndex = lowerText.indexOf(word, currentPos + words[i-1].length);

          if (wordIndex !== -1 && wordIndex < searchEnd) {
            matchEnd = wordIndex + word.length;
            currentPos = wordIndex;
            wordsMatched++;
          } else {
            break;
          }
        }

        // If we matched most words, consider it a match
        if (wordsMatched >= Math.ceil(words.length * 0.6)) {
          matches.push({ start: firstWordIndex, end: matchEnd });
        }

        searchStart = firstWordIndex + 1;
      }

      return matches;
    };

    const highlightTextRange = (textParts: any[], start: number, end: number, fullText: string) => {
      let currentPos = 0;
      let firstMarkElement: HTMLElement | null = null;

      for (const part of textParts) {
        const partStart = currentPos;
        const partEnd = currentPos + part.text.length;

        // Check if this part overlaps with the highlight range
        const overlapStart = Math.max(start, partStart);
        const overlapEnd = Math.min(end, partEnd);

        if (overlapStart < overlapEnd) {
          // This part needs highlighting
          const localStart = overlapStart - partStart;
          const localEnd = overlapEnd - partStart;

          try {
            const span = part.span;
            const textNode = span.firstChild;

            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
              const text = textNode.textContent || "";
              const beforeText = text.substring(0, localStart);
              const highlightText = text.substring(localStart, localEnd);
              const afterText = text.substring(localEnd);

              if (highlightText.trim()) {
                const mark = document.createElement("mark");
                mark.style.backgroundColor = "#ffeb3b";
                mark.style.borderRadius = "3px";
                mark.style.padding = "0 2px";
                mark.textContent = highlightText;

                span.removeChild(textNode);

                if (beforeText) span.appendChild(document.createTextNode(beforeText));
                span.appendChild(mark);
                if (afterText) span.appendChild(document.createTextNode(afterText));

                if (!firstMarkElement) {
                  firstMarkElement = mark;
                }
              }
            }
          } catch (e) {
            console.error("Error highlighting part:", e);
          }
        }

        currentPos += part.text.length + 1; // +1 for the space we add between parts
      }

      return firstMarkElement;
    };

    const timeoutId = setTimeout(highlightPdfText, 2000);
    return () => clearTimeout(timeoutId);
  }, [highlight, numPages]);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div ref={containerRef} className="bg-gray-100">
      <Document file={file} onLoadSuccess={onLoadSuccess}>
        {Array.from(new Array(numPages), (_, index) => (
          <div key={`page_${index + 1}`} className="mb-8 flex justify-center">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
              <Page
                pageNumber={index + 1}
                width={800}
                renderTextLayer={true}
                renderAnnotationLayer={false}
              />
              <div className="bg-gray-200 px-4 py-2 text-center text-sm text-gray-700 font-medium">
                Page {index + 1} of {numPages}
              </div>
            </div>
          </div>
        ))}
      </Document>
    </div>
  );
}
