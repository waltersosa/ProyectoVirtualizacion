import React from 'react';
import { Edit, Trash2, Wifi, WifiOff } from 'lucide-react';
import { Device } from '../types/types';

interface DeviceCardProps {
  device: Device;
  onEdit: (device: Device) => void;
  onDelete: (deviceId: string) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onEdit, onDelete }) => {
  const isOnline = device.status === 'online';

  return (
    <div className={`bg-gray-800 rounded-xl p-6 shadow-lg border-2 transition-all duration-300 ${
      isOnline ? 'border-green-500/30' : 'border-red-500/30'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{device.name}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <Wifi className="w-4 h-4" />
                  Online
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-400 text-sm">
                  <WifiOff className="w-4 h-4" />
                  Offline
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">IP: {device.ipAddress}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(device)}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4 text-blue-400" />
          </button>
          <button
            onClick={() => onDelete(device._id)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};