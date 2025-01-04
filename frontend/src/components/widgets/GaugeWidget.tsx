import React from 'react';

interface GaugeWidgetProps {
  value: number;
  title: string;
  min?: number;
  max?: number;
}

export const GaugeWidget: React.FC<GaugeWidgetProps> = ({
  title,
  value,
  min,
  max
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
      <div className="relative pt-2">
        <div className="overflow-hidden h-8 text-xs flex rounded-full bg-gray-700/50">
          <div
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500/50"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-200">
            {value.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}; 