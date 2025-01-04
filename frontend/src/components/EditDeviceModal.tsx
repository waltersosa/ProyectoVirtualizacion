import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Device } from '../types/types';
import { commonStyles } from '../styles/common';

interface EditDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deviceData: Device) => void;
  device: Device;
}

export const EditDeviceModal: React.FC<EditDeviceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  device
}) => {
  const [deviceData, setDeviceData] = useState({
    name: device.name,
    type: device.type,
    ipAddress: device.ipAddress,
    peripherals: device.peripherals,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...device,
      ...deviceData
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${commonStyles.card} p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${commonStyles.text.primary}`}>
            Editar Dispositivo
          </h2>
          <button 
            onClick={onClose}
            className={`${commonStyles.text.secondary} hover:${commonStyles.text.primary}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${commonStyles.text.secondary} mb-1`}>
              Nombre del Dispositivo
            </label>
            <input
              type="text"
              value={deviceData.name}
              onChange={(e) => setDeviceData({ ...deviceData, name: e.target.value })}
              className={commonStyles.input}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${commonStyles.text.secondary} mb-1`}>
              Tipo de Dispositivo
            </label>
            <select
              value={deviceData.type}
              onChange={(e) => setDeviceData({ ...deviceData, type: e.target.value })}
              className={commonStyles.input}
            >
              <option value="sensor">Sensor</option>
              <option value="actuator">Actuador</option>
              <option value="controller">Controlador</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${commonStyles.text.secondary} mb-1`}>
              Dirección IP
            </label>
            <input
              type="text"
              value={deviceData.ipAddress}
              onChange={(e) => setDeviceData({ ...deviceData, ipAddress: e.target.value })}
              className={commonStyles.input}
              pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
              placeholder="192.168.1.100"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${commonStyles.text.secondary} mb-1`}>
              Periféricos
            </label>
            <div className="space-y-2">
              {['DHT11', 'Relay', 'LED'].map(peripheral => (
                <label key={peripheral} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={deviceData.peripherals.includes(peripheral)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDeviceData({
                          ...deviceData,
                          peripherals: [...deviceData.peripherals, peripheral]
                        });
                      } else {
                        setDeviceData({
                          ...deviceData,
                          peripherals: deviceData.peripherals.filter(p => p !== peripheral)
                        });
                      }
                    }}
                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                  />
                  <span className={commonStyles.text.secondary}>{peripheral}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={commonStyles.button.secondary}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={commonStyles.button.primary}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 