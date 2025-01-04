import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Widget, Device } from '../types/types';

interface EditWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (widgetData: Widget) => void;
  widget: Widget;
  devices: Device[];
}

export const EditWidgetModal: React.FC<EditWidgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  widget,
  devices
}) => {
  const [widgetData, setWidgetData] = useState(widget);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(widgetData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Editar Widget</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={widgetData.title}
              onChange={(e) => setWidgetData({ ...widgetData, title: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dispositivo</label>
            <select
              value={widgetData.device}
              onChange={(e) => setWidgetData({ ...widgetData, device: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccionar dispositivo</option>
              {devices.map(device => (
                <option key={device._id} value={device._id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 