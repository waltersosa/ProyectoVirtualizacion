import React, { useEffect } from 'react';
import { Widget } from '../types/types';
import { WidgetRenderer } from './WidgetRenderer';
import { useDevices } from '../context/DeviceContext';
import { commonStyles } from '../styles/common';

interface DashboardProps {
  widgets: Widget[];
  onEditWidget: (widget: Widget) => void;
  onDeleteWidget: (widgetId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  widgets, 
  onEditWidget, 
  onDeleteWidget 
}) => {
  const { devices, updateDevice } = useDevices();

  // Solo manejar actualizaciones de dispositivos
  useEffect(() => {
    const handleDeviceUpdate = (event: CustomEvent) => {
      const { deviceId, updates } = event.detail;
      updateDevice(deviceId, updates);
    };

    window.addEventListener('deviceUpdate', handleDeviceUpdate as EventListener);
    return () => {
      window.removeEventListener('deviceUpdate', handleDeviceUpdate as EventListener);
    };
  }, [updateDevice]);

  const handleEditWidget = (widget: Widget) => {
    onEditWidget(widget);
  };

  const handleDeleteWidget = (widgetId: string) => {
    onDeleteWidget(widgetId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${commonStyles.card} p-6`}>
        <h1 className={`text-2xl font-bold ${commonStyles.text.primary} mb-2`}>IoT Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className={commonStyles.text.secondary}>
            <span className="font-medium">{widgets.length}</span> Widgets
          </div>
          <div>•</div>
          <div className={commonStyles.text.secondary}>
            <span className="font-medium">{devices.length}</span> Devices
          </div>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {widgets.map(widget => {
          const deviceId = typeof widget.device === 'object' 
            ? (widget.device as any)._id 
            : widget.device;
          
          const deviceData = devices.find(d => d._id === deviceId);
          
          console.log('Widget device data:', {
            widgetId: widget._id,
            deviceId,
            deviceFound: !!deviceData,
            deviceData,
            originalDevice: widget.device
          });
          
          return (
            <WidgetRenderer
              key={widget._id}
              widget={widget}
              deviceData={deviceData}
              devices={devices}
              onEdit={handleEditWidget}
              onDelete={handleDeleteWidget}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {widgets.length === 0 && (
        <div className={`${commonStyles.card} p-12 text-center`}>
          <p className={`text-lg ${commonStyles.text.primary}`}>No widgets added yet.</p>
          <p className={`text-sm ${commonStyles.text.secondary}`}>
            Click the "Add Widget" button to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 