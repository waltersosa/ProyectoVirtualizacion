import React from 'react';

interface SliderWidgetProps {
  title: string;
  value?: number;
  onChange: (value: number) => void;
}

export const SliderWidget: React.FC<SliderWidgetProps> = ({ title, value = 0, onChange }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      <div className="text-center mt-2">
        <span className="text-xl font-bold text-blue-500">{value}%</span>
      </div>
    </div>
  );
}; 