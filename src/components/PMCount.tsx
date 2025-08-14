import React from 'react';

interface PMCountProps {
  plus: number;
  minus: number;
  count: number;
}

export const PMCount: React.FC<PMCountProps> = ({ plus, minus, count }) => {
  return (
    <div className="text-xs text-gray-500">
      +{plus} / -{minus} · {count} notes
    </div>
  );
};
