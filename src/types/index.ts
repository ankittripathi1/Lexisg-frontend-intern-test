export interface Citation {
  text: string;
  source: string;
  pdfUrl: string; 
  highlightText?: string; // Text to highlight in the PDF
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}