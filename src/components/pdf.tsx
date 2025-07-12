import { useState } from 'react';
import { Page, Document } from 'react-pdf';

export default function PDFComponent() {
  const [numPages, setNumPages] = useState<number>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document file={"/example.pdf"} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  )
}