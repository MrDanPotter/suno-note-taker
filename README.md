# Suno Note Taker

A React TypeScript application for comparing and rating Suno AI-generated songs using a structured category-based scoring system. Built with modern React patterns and proper separation of concerns.

## Features

- **Song Management**: Add Suno songs via iframe embeds, URLs, or raw IDs
- **Structured Note Taking**: Rate songs across specific categories (Intro, Verse, Bridge, Chorus, Outro, Vocals, Timing, Overall Vibe)
- **Category-Based Scoring**: Each category is rated on a 0-5 scale for consistent evaluation
- **Multiple Verses/Bridges**: Support for rating multiple verses and bridges with automatic numbering
- **Automatic Scoring**: Overall score calculated as average of all completed categories
- **Manual Sorting**: Sort songs by total score or average score with a manual sort button
- **Local Storage**: All data is saved locally in your browser
- **Getting Started Guide**: Step-by-step instructions for adding your first song

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Local Storage** for data persistence
- **Modern React Patterns** (hooks, functional components)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddSongModal.tsx       # Modal for adding new songs
│   ├── CategoryRatingModal.tsx # Modal for rating specific categories
│   ├── EmptyState.tsx         # Empty state when no songs exist
│   ├── Footer.tsx             # App footer
│   ├── Header.tsx             # App header with navigation
│   ├── ScorePill.tsx          # Score display component
│   ├── SectionHeader.tsx      # Section headers with controls
│   ├── SongCard.tsx           # Individual song display with category buttons
│   └── index.ts               # Component exports
├── types/              # TypeScript type definitions
│   └── index.ts           # App interfaces and types
├── utils/              # Utility functions
│   └── index.ts           # Helper functions and constants
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd suno-note-taker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

### Adding Songs

1. Click the "Add song link" button
2. Paste a Suno iframe embed, URL, or raw song ID
3. The app will automatically parse and add the song

### Taking Notes

The new system uses a structured approach with specific categories:

1. **Category Buttons**: Each song card displays buttons for different categories:
   - Intro, Verse, Bridge, Chorus, Outro
   - Vocals, Timing, Overall Vibe

2. **Rating Process**:
   - Click any category button to add it to the song card
   - Use the inline slider to adjust the score from 0-5 with 0.1 precision
   - Scores update in real-time as you move the slider
   - Delete ratings using the × button on each rating component

3. **Multiple Verses/Bridges**:
   - Verse and Bridge buttons remain active after rating
   - Click again to add the next verse/bridge (Verse 2, Bridge 2, etc.)
   - Each verse/bridge gets its own rating slider

4. **Inline Interface**:
   - All rating sliders are visible directly on the song card
   - No modal popups - everything is accessible at a glance
   - Decimal precision (0.1) for fine-tuned scoring

### Scoring System

- **Individual Categories**: Rated 0-5 (0 = poor, 5 = excellent)
- **Overall Score**: Average of all completed categories
- **Total Score**: Sum of all category scores
- **Consistent Evaluation**: Same categories across all songs for fair comparison

### Managing Songs

- **Remove songs**: Click the "Remove" button on any song card
- **Delete ratings**: Click "×" on individual category scores
- **Sort songs**: Click the "Sort" button to order by total or average score

### Getting Started

- **Instructions**: Click "Getting Started" for step-by-step guidance on adding songs
- **Step-by-step process**: Clear instructions for copying Suno embed codes
- **Pro tips**: Additional guidance for different input formats

## Supported Input Formats

The app accepts various Suno input formats:

- **Iframe embeds**: `<iframe src="https://suno.com/embed/...">`
- **Embed URLs**: `https://suno.com/embed/[song-id]`
- **Song URLs**: `https://suno.com/song/[song-id]`
- **Raw IDs**: `[36-character-song-id]`

## Development

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Proper separation of concerns
- Consistent naming conventions
- Optimized rendering with useCallback and useMemo to prevent unnecessary re-renders

### Testing

The app includes inline tests for core utility functions. Run the app and check the browser console for test results.

### Adding New Features

1. Define types in `src/types/index.ts`
2. Add utility functions in `src/utils/index.ts`
3. Create components in `src/components/`
4. Update the main App component as needed

## Migration from Old System

The app automatically migrates data from the previous free-form note system:
- Old notes are converted to "Overall Vibe" category ratings
- Scores are converted from -2 to +2 scale to 0-5 scale
- All existing data is preserved during migration

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
