export interface PdfViewerParams {
  file: string;
  highlight?: string;
  page?: number;
}

export function generatePdfViewerUrl(params: PdfViewerParams): string {
  const searchParams = new URLSearchParams();
  
  searchParams.set('file', params.file);
  
  if (params.highlight) {
    searchParams.set('highlight', params.highlight);
  }
  
  if (params.page) {
    searchParams.set('page', params.page.toString());
  }
  
  return `/pdf-viewer?${searchParams.toString()}`;
}

export function openPdfInNewTab(params: PdfViewerParams): void {
  const url = generatePdfViewerUrl(params);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function extractFilename(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 1] || filePath;
}

export function isValidPdfUrl(url: string): boolean {
  try {
    const isUrl = url.startsWith('http') || url.startsWith('https');
    const isRelativePath = url.startsWith('/') || url.startsWith('./');
    const hasPdfExtension = url.toLowerCase().endsWith('.pdf');
    
    return (isUrl || isRelativePath) && hasPdfExtension;
  } catch {
    return false;
  }
}