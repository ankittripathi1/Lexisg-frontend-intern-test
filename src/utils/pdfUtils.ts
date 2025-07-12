/**
 * Utility functions for PDF handling and URL generation
 */

export interface PdfViewerParams {
  file: string;
  highlight?: string;
  page?: number;
}

/**
 * Generate a PDF viewer URL with highlighting parameters
 */
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

/**
 * Open PDF in new tab with highlighting
 */
export function openPdfInNewTab(params: PdfViewerParams): void {
  const url = generatePdfViewerUrl(params);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Extract filename from URL or path
 */
export function extractFilename(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 1] || filePath;
}

/**
 * Check if a string is a valid PDF URL
 */
export function isValidPdfUrl(url: string): boolean {
  try {
    // Check if it's a valid URL or relative path
    const isUrl = url.startsWith('http') || url.startsWith('https');
    const isRelativePath = url.startsWith('/') || url.startsWith('./');
    const hasPdfExtension = url.toLowerCase().endsWith('.pdf');
    
    return (isUrl || isRelativePath) && hasPdfExtension;
  } catch {
    return false;
  }
}