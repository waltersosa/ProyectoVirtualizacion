import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Device } from '../types/types';
import { deviceService } from '../services/api';
import { commonStyles } from '../styles/common';
import { EditDeviceModal } from './EditDeviceModal';

interface DevicesProps {
  devices: Device[];
  onAddDevice: () => void;
  onEditDevice: (device: Device) => void;
  onDeleteDevice: (deviceId: string) => void;
}

export const Devices: React.FC<DevicesProps> = ({
  devices = [],
  onAddDevice,
  onEditDevice,
  onDeleteDevice,
}) => {
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  if (!Array.isArray(devices)) {
    console.error('Devices is not an array:', devices);
    return <div>Error: No se pudieron cargar los dispositivos</div>;
  }

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
  };

  const handleSave = (updatedDevice: Device) => {
    onEditDevice(updatedDevice);
    setEditingDevice(null);
  };

  const handleDelete = async (device: Device) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el dispositivo "${device.name}"?`)) {
      try {
        await deviceService.deleteDevice(device._id);
        onDeleteDevice(device._id);
      } catch (error) {
        console.error('Error deleting device:', error);
        alert('Error al eliminar el dispositivo');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${commonStyles.text.primary}`}>Dispositivos</h1>
        <button
          onClick={onAddDevice}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2"
        >
          <Plus className="w-5 h-5" />
          Añadir Dispositivo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div
            key={device._id}
            className={`${commonStyles.card} p-6 space-y-4`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`text-lg font-semibold ${commonStyles.text.primary}`}>
                  {device.name}
                </h3>
                <p className={`text-sm ${commonStyles.text.secondary}`}>
                  {device.type}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(device)}
                  className={`${commonStyles.button.icon} bg-blue-500 hover:bg-blue-600`}
                  title="Editar dispositivo"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(device)}
                  className={`${commonStyles.button.icon} bg-red-500 hover:bg-red-600`}
                  title="Eliminar dispositivo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={commonStyles.text.secondary}>Estado:</span>
                <span className={`${device.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                  {device.status === 'online' ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={commonStyles.text.secondary}>IP:</span>
                <span className={commonStyles.text.primary}>{device.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className={commonStyles.text.secondary}>Variable:</span>
                <span className={commonStyles.text.primary}>{device.dataVariable}</span>
              </div>
              <div className="flex justify-between">
                <span className={commonStyles.text.secondary}>Periféricos:</span>
                <span className={commonStyles.text.primary}>
                  {device.peripherals.join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {devices.length === 0 && (
        <div className={`${commonStyles.card} p-12 text-center`}>
          <p className={`text-lg ${commonStyles.text.primary}`}>No hay dispositivos añadidos.</p>
          <p className={`text-sm ${commonStyles.text.secondary}`}>
            Haz clic en "Añadir Dispositivo" para comenzar.
          </p>
        </div>
      )}

      {editingDevice && (
        <EditDeviceModal
          isOpen={true}
          onClose={() => setEditingDevice(null)}
          onSave={handleSave}
          device={editingDevice}
        />
      )}
    </div>
  );
};