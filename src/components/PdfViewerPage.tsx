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
        <div className="h-screen w-screen bg-gray-100 flex flex-col">
            {/* PDF Viewer */}
            <div className="flex-1 overflow-y-auto p-6">
                <HighlightPdfViewer file={file} highlight={highlight} />
            </div>
        </div>
    );
}
