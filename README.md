# Suno Note Taker

A React TypeScript application for comparing and rating Suno AI-generated songs. Built with modern React patterns and proper separation of concerns.

## Features

- **Song Management**: Add Suno songs via iframe embeds, URLs, or raw IDs
- **Note Taking**: Rate songs with scores from -2 to +2 and add descriptive notes
- **Scoring System**: Automatic calculation of total scores and averages
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
│   ├── AddSongModal.tsx    # Modal for adding new songs
│   ├── EmptyState.tsx      # Empty state when no songs exist
│   ├── Footer.tsx          # App footer
│   ├── Header.tsx          # App header with navigation
│   ├── PMCount.tsx         # Plus/minus count display
│   ├── ScorePill.tsx       # Score display component
│   ├── SectionHeader.tsx   # Section headers with controls
│   ├── SongCard.tsx        # Individual song display
│   └── index.ts            # Component exports
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

1. For each song, use the score selector (-2 to +2)
2. Write a descriptive note about your impression
3. Click "Add note" or press Enter

### Managing Songs

- **Remove songs**: Click the "Remove" button on any song card
- **Delete notes**: Click "Delete" on individual notes
- **Sort songs**: Click the "Sort" button to order by total or average score (songs stay in place while adding notes)

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

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
