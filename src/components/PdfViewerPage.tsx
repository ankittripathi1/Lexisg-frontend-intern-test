import { useSearchParams } from 'react-router-dom'
import HighlightPdfViewer from '../components/HighlightPdfViewer';

export default function PdfViewerPage() {
    const [params] = useSearchParams();
    const file = params.get('file');
    const highlight = params.get("highlight") || "";

    if (!file) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">No PDF File Provided</h1>
                    <p className="text-gray-600">Please provide a valid PDF file URL to view.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with file info and highlight info */}
            <div className="bg-white shadow-sm border-b px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-xl font-semibold text-gray-800 mb-2">PDF Viewer</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                            📄 <strong>File:</strong> {decodeURIComponent(file)}
                        </span>
                        {highlight ? (
                            <span className="flex items-center gap-2">
                                🔍 <strong>Highlighting:</strong>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                                    "{highlight}"
                                </span>
                            </span>
                        ) : (
                            <span className="text-gray-500">
                                ✨ Tip: You can highlight text by adding a `highlight` parameter to the URL.
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex items-center justify-center p-6">
                <HighlightPdfViewer file={file} highlight={highlight} />
            </div>
        </div>
    );
}
