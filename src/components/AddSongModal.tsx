import React, { useState } from 'react';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSong: (parsedInput: { paste: string }) => void;
  error: string | null;
}

export const AddSongModal: React.FC<AddSongModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddSong, 
  error 
}) => {
  const [paste, setPaste] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 bg-black/20 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Add Suno song link</h3>
            <p className="text-sm text-gray-500">
              Paste an embed iframe, an embed URL, a song URL, or the raw song ID.
            </p>
          </div>
          <button 
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
        
        <textarea 
          className="w-full border rounded-xl p-3 text-sm h-28" 
          placeholder={`Example iframe or URL...\n<iframe src="..."></iframe>\n...`} 
          value={paste} 
          onChange={(e) => setPaste(e.target.value)} 
        />
        
        {error && (
          <div className="mt-2 text-sm text-red-600">{error}</div>
        )}
        
        <div className="mt-4 flex items-center justify-end gap-2">
          <button 
            className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" 
            onClick={() => {
              if (paste.trim()) {
                onAddSong({ paste: paste.trim() });
              }
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
