
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
          <div className="mt-4 pt-4 border-t border-gray-300/50">
            <h4 className="text-sm font-bold mb-2">Citations:</h4>
            {citations.map((citation, index) => (
              <div key={index} className="bg-gray-200/50 p-3 rounded-lg mb-3 last:mb-0">
                <blockquote className="text-sm italic border-l-4 border-gray-400 pl-4 mb-2">
                  "{citation.text}"
                </blockquote>
                <div className="text-xs text-gray-700 flex items-center gap-2">
                  <span className="font-semibold">Source:</span>
                  <button
                    onClick={() => handlePdfClick(citation)}
                    className="text-blue-700 hover:underline cursor-pointer bg-transparent border-none p-0 font-medium"
                  >
                    {citation.source}
                  </button>
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

