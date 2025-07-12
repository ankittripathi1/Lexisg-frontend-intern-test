
import type { ChatMessage, Citation } from '../types';
import { openPdfInNewTab, isValidPdfUrl } from '../utils/pdfUtils';


export default function MessageBubble({
  type,
  content,
  citations,
  timestamp,
}: ChatMessage) {
  // Function to handle PDF opening with highlighting
  const handlePdfClick = (citation: Citation) => {
    if (citation.pdfUrl && isValidPdfUrl(citation.pdfUrl)) {
      // Open PDF in new tab with highlighting using utility function
      openPdfInNewTab({
        file: citation.pdfUrl,
        highlight: citation.highlightText
      });
    }
  };

  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl rounded-lg p-4 ${type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="whitespace-pre-wrap">{content}</div>

        {citations && citations.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-300">
            <h4 className="text-sm font-semibold mb-2">Citations:</h4>
            {citations.map((citation, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <blockquote className="text-sm italic border-l-3 border-gray-400 pl-3 mb-1">
                  "{citation.text}"
                </blockquote>
                <div className="text-xs text-gray-600 flex items-center gap-2">
                  <span className="font-medium">Source: </span>
                  <button
                    onClick={() => handlePdfClick(citation)}
                    className="text-blue-600 hover:text-blue-800 underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                  >
                    {citation.source}
                  </button>
                  {citation.pdfUrl && citation.highlightText && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 ml-2">
                      📄 PDF with highlights
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs opacity-70 mt-2">{timestamp.toLocaleTimeString()}</div>
      </div>
    </div>
  );
}

