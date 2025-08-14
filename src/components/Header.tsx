import React from 'react';

interface HeaderProps {
  onShowAdd: () => void;
  onImport: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowAdd, onImport, onExport }) => {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white grid place-content-center font-bold">
            S
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Suno Song Comparator</h1>
            <p className="text-xs text-gray-500">Add embedded links, take notes, and rank versions.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" 
            onClick={onImport}
          >
            Import
          </button>
          <button 
            className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" 
            onClick={onExport}
          >
            Export
          </button>
          <button 
            className="text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" 
            onClick={onShowAdd}
          >
            + Add song link
          </button>
        </div>
      </div>
    </header>
  );
};
