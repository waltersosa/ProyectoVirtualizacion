import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Device } from '../types/types';
import { DeviceCard } from './DeviceCard';
import { EditDeviceModal } from './EditDeviceModal';

interface DevicesProps {
  devices: Device[];
  onAddDevice: () => void;
  onEditDevice: (device: Device) => void;
  onDeleteDevice: (deviceId: string) => void;
}

export const Devices: React.FC<DevicesProps> = ({
  devices,
  onAddDevice,
  onEditDevice,
  onDeleteDevice,
}) => {
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
  };

  const handleSave = (updatedDevice: Device) => {
    onEditDevice(updatedDevice);
    setEditingDevice(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Devices</h1>
          <p className="text-gray-400">Manage your IoT devices</p>
        </div>
        <button
          onClick={() => onAddDevice()}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2"
        >
          <Plus className="w-5 h-5" />
          Add Device
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map(device => (
          <DeviceCard
            key={device._id}
            device={device}
            onEdit={() => handleEdit(device)}
            onDelete={onDeleteDevice}
          />
        ))}
      </div>
      
      {editingDevice && (
        <EditDeviceModal
          isOpen={true}
          onClose={() => setEditingDevice(null)}
          onSave={handleSave}
          device={editingDevice}
        />
      )}
    </>
  );
};