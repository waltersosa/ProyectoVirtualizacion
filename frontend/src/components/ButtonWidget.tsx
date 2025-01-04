import React from 'react';

interface ButtonWidgetProps {
  title: string;
  onClick: () => void;
}

export const ButtonWidget: React.FC<ButtonWidgetProps> = ({ title, onClick }) => {
  return (
    <button onClick={onClick} className="bg-blue-500 text-white px-4 py-2 rounded">
      {title}
    </button>
  );
}; 