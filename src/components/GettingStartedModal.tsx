import React from 'react';

interface GettingStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GettingStartedModal: React.FC<GettingStartedModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 bg-black/20 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Getting Started</h3>
            <p className="text-sm text-gray-500 mt-1">Follow these steps to add your first Suno song</p>
          </div>
          <button 
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium">Open Suno</p>
              <p className="text-sm text-gray-600">Go to ... and navigate to the song you want to import</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium">Open Share Menu</p>
              <p className="text-sm text-gray-600">Click the "Share" button on your song</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium">Select Embed Option</p>
              <p className="text-sm text-gray-600">Click "Share to..." then select the "Embed" option</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
              4
            </div>
            <div>
              <p className="font-medium">Copy Embed Code</p>
              <p className="text-sm text-gray-600">Click the "Copy" button to copy the iframe embed code</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
              5
            </div>
            <div>
              <p className="font-medium">Paste in App</p>
              <p className="text-sm text-gray-600">Click "Add song link" in this app and paste the copied embed code</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button 
            className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" 
            onClick={onClose}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
