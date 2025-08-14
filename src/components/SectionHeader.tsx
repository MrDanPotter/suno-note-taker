import React, { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  count?: number;
  right?: ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, count, right }) => {
  return (
    <div className="flex items-center justify-between mt-8 mb-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="flex items-center gap-3">
        {right}
        {typeof count === "number" && (
          <span className="text-sm text-gray-500">{count}</span>
        )}
      </div>
    </div>
  );
};
