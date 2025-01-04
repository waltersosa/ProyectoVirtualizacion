import React from 'react';
import { Thermometer, Droplets, Wifi, WifiOff } from 'lucide-react';

interface ThermometerWidgetProps {
  title: string;
  deviceId: string;
  readings?: {
    temperature?: number | null;
    humidity?: number | null;
  };
  status?: string;
}

export const ThermometerWidget: React.FC<ThermometerWidgetProps> = ({ 
  title, 
  readings,
  status 
}) => {
  const temperature = readings?.temperature ?? 0;
  const humidity = readings?.humidity ?? 0;
  const isOnline = status === 'online';

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {isOnline ? (
          <div className="flex items-center text-green-400">
            <Wifi className="w-4 h-4 mr-1" />
            <span className="text-sm">Online</span>
          </div>
        ) : (
          <div className="flex items-center text-red-400">
            <WifiOff className="w-4 h-4 mr-1" />
            <span className="text-sm">Offline</span>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-400" />
            <span className="text-gray-300">Temperatura</span>
          </div>
          <div className="text-2xl font-bold text-red-400">
            {temperature}°C
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">Humedad</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {humidity}%
          </div>
        </div>
      </div>
    </div>
  );
}; 