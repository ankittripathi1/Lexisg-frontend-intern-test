// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ChatInterface from "./components/ChatInterface";
// import { Container } from "./components/Container";
// import PdfViewerPage from "./components/PdfViewerPage";


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={
//           <div className="min-h-screen">
//             <Container>
//               <nav className="flex items-center mb-6 py-2">
//                 <img
//                   src="https://framerusercontent.com/images/CSr01inYFSNcBiRsiHyP21guEk.png"
//                   className="w-8 h-8 mr-4"
//                 />
//                 <span className="text-2xl font-bold">Lexi</span>
//               </nav>
//               <div className="flex justify-center">
//                 <ChatInterface />
//               </div>
//             </Container>
//           </div>
//         } />

//         <Route path="/pdf-viewer" element={<PdfViewerPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;



import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatInterface from "./components/ChatInterface";
import { Container } from "./components/Container";
import PdfViewerPage from "./components/PdfViewerPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50">
            <Container>
              <nav className="flex items-center justify-between mb-6 py-4 border-b-2 border-gray-100">
                <div className="flex items-center">
                  <img
                    src="https://framerusercontent.com/images/CSr01inYFSNcBiRsiHyP21guEk.png"
                    className="w-10 h-10 mr-4"
                  />
                  <span className="text-3xl font-bold text-gray-800">Lexi</span>
                </div>
              </nav>
              <div className="flex justify-center">
                <ChatInterface />
              </div>
            </Container>
          </div>
        } />

        <Route path="/pdf-viewer" element={<PdfViewerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
