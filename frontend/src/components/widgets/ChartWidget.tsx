import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ChartWidgetProps {
  data: Array<{ time: string; value: number }>;
  title: string;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ data, title }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <LineChart width={300} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}; 