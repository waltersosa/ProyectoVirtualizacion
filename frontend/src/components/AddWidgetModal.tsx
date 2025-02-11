import React, { useState, useEffect } from 'react';
import { X, Gauge, Thermometer, Map, Table, Activity, Sliders, Power } from 'lucide-react';
import { deviceService } from '../services/api';
import { Device, CreateWidgetData, Widget } from '../types/types';
import { commonStyles } from '../styles/common';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (widgetData: CreateWidgetData) => void;
  onUpdate?: (widgetData: Widget) => void;
  devices: Device[];
  widgetToEdit?: Widget;
}

const widgetTypes = [
  { value: 'button', label: 'Botón de Control' },
  { value: 'thermometer', label: 'Termómetro' }
];

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  devices,
  widgetToEdit
}) => {
  const [widgetData, setWidgetData] = useState<CreateWidgetData>(() => {
    if (widgetToEdit) {
      return {
        title: widgetToEdit.title,
        type: widgetToEdit.type,
        device: widgetToEdit.device,
        config: widgetToEdit.config
      };
    }
    return {
      title: '',
      type: '',
      device: '',
      config: {}
    };
  });

  useEffect(() => {
    async function fetchDevices() {
      try {
        await deviceService.getDevices();
      } catch (error) {
        console.error('Error fetching devices in AddWidgetModal:', error);
      }
    }

    if (isOpen) {
      fetchDevices();
    }
  }, [isOpen]);

  const handleTypeSelect = (typeId: string) => {
    const selectedType = widgetTypes.find(type => type.value === typeId);
    setWidgetData({
      ...widgetData,
      type: typeId,
      config: selectedType?.defaultConfig
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!widgetData.type) {
      alert('Por favor seleccione un tipo de widget');
      return;
    }
    
    if (!widgetData.title.trim()) {
      alert('Por favor ingrese un título para el widget');
      return;
    }

    onAdd(widgetData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${commonStyles.card} p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${commonStyles.text.primary}`}>
            {widgetToEdit ? 'Edit Widget' : 'Add Widget'}
          </h2>
          <button onClick={onClose} className={`${commonStyles.text.secondary} hover:${commonStyles.text.primary}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Widget Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {widgetTypes.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleTypeSelect(value)}
                  className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    widgetData.type === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Widget Title
            </label>
            <input
              type="text"
              value={widgetData.title}
              onChange={(e) => setWidgetData({ ...widgetData, title: e.target.value })}
              className={commonStyles.input}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Connected Device
            </label>
            <select
              value={widgetData.device}
              onChange={(e) => setWidgetData({ ...widgetData, device: e.target.value })}
              className={commonStyles.input}
            >
              <option value="">Select a device</option>
              {devices.map(device => (
                <option key={device._id || 'default-id'} value={device._id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={`${commonStyles.button.primary} w-full`}>
            {widgetToEdit ? 'Save Changes' : 'Add Widget'}
          </button>
        </form>
      </div>
    </div>
  );
};