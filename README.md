# LexisNexis Frontend Internship Test

This project is a solution for the Lexisg Frontend Internship Test. It is a React
application built with React that allows users to interact with a chat interface
and view source PDF documents with highlighted citations.

## How to Run the Project

To run the project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ankittripathi1/Lexisg-frontend-intern-test.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   This will start the application on `http://localhost:5173`.

## Screenshots

| Chat Interface                                                                                         | Answer + Citations                                                                                   | PDF Viewer                                                                                     |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| ![Initial](https://github.com/ankittripathi1/Lexisg-frontend-intern-test/blob/main/assets/initial.png) | ![Answer](https://github.com/ankittripathi1/Lexisg-frontend-intern-test/blob/main/assets/answer.png) | ![PDF](https://github.com/ankittripathi1/Lexisg-frontend-intern-test/blob/main/assets/pdf.png) |


## How Citation Linking was Handled

The citation linking is handled by a combination of frontend components and utility functions.
Here's a breakdown of the implementation:

**1. Chat Interface:**

- The `ChatInterface.tsx` component manages the chat messages and the interaction with a mock API.
- When the user sends a message, the mock API returns a response that includes an answer and an array of citations.
- Each citation object contains the following information:
  - `text`: The text of the citation.
  - `source`: The name of the PDF document.
  - `pdfUrl`: The URL of the PDF document.
  - `highlightText`: The text to be highlighted in the PDF document.

**2. PDF Viewer:**

- The `HighlightPdfViewer.tsx` component is responsible for rendering the PDF document and highlighting the cited text.
- It uses the `react-pdf` library to render the PDF and a custom highlighting implementation to find and highlight the exact text.
- The `highlight` prop is passed to the component, which contains the text to be highlighted.
- The component then uses a combination of exact and fuzzy matching to find the text in the PDF and wrap it in a `<mark>` tag.

**3. Utility Functions:**

- The `pdfUtils.ts` file contains utility functions for generating PDF viewer URLs and opening PDFs in a new tab.
- The `generatePdfViewerUrl` function creates a URL with the `file` and `highlight` parameters, which are then used by the `HighlightPdfViewer.tsx` component to render the PDF and highlight the text.
- The `openPdfInNewTab` function opens the PDF in a new tab with the highlighting parameters.

**4. Citation Linking:**

- In the `MessageBubble.tsx` component, the citations are rendered as links that, when clicked, open the PDF in a new tab with the cited text highlighted.
- The `onClick` handler for the citation link calls the `openPdfInNewTab` function with the `pdfUrl` and `highlightText` from the citation object.
- This opens the PDF in a new tab and highlights the cited text, providing a seamless user experience.

## Known Limitation

> 🔍 **Highlighting large blocks of text in the PDF is not always accurate.**

While the highlighting feature works well for **shorter phrases**, it may **fail or behave inconsistently with longer paragraphs or multi-line text**. This is due to how text is tokenized and rendered by `react-pdf` and PDF parsing complexities (e.g. line breaks, font spacing, hidden characters).

I'm currently exploring more robust solutions to improve this experience.
