import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="rounded-2xl border border-dashed p-8 text-center text-gray-600 bg-white">
      <p className="mb-3">
        Click <span className="font-semibold">"Add song link"</span> and paste a Suno embed iframe or URL.
      </p>
      <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto text-left">
        {`<iframe src="https://suno.com/embed/96bdf0e9-bac4-414c-bc32-40fb90fcb15a" width="760" height="240"></iframe>`}
      </pre>
    </div>
  );
};
