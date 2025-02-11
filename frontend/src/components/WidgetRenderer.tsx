import React, { useState, useEffect } from 'react';
import { GaugeWidget } from './widgets/GaugeWidget';
import { ThermometerWidget } from './widgets/ThermometerWidget';
import { SliderWidget } from './widgets/SliderWidget';
import { MapWidget } from './widgets/MapWidget';
import { ButtonWidget } from './widgets/ButtonWidget';
import { RelayWidget } from './widgets/RelayWidget';
import { DHT11Widget } from './widgets/DHT11Widget';
import { Widget, Device } from '../types/types';
import { deviceService } from '../services/api';
import { StatusIndicator } from './StatusIndicator';
import { commonStyles } from '../styles/common';
import { Edit, Trash2 } from 'lucide-react';

interface WidgetRendererProps {
  widget: Widget;
  deviceData?: Device;
  devices: Device[];
  onEdit: (widget: Widget) => void;
  onDelete: (widgetId: string) => void;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ 
  widget, 
  deviceData,
  devices,
  onEdit,
  onDelete
}) => {
  const [localDeviceData, setLocalDeviceData] = useState(deviceData);

  // Actualizar datos locales cuando cambian los datos del dispositivo
  useEffect(() => {
    setLocalDeviceData(deviceData);
  }, [deviceData]);

  // Suscribirse a actualizaciones del dispositivo específico
  useEffect(() => {
    const handleDeviceUpdate = (event: CustomEvent) => {
      const { deviceId, updates } = event.detail;
      if (deviceId === widget.device) {
        setLocalDeviceData(prev => prev ? { ...prev, ...updates } : prev);
      }
    };

    window.addEventListener('deviceUpdate', handleDeviceUpdate as EventListener);
    return () => {
      window.removeEventListener('deviceUpdate', handleDeviceUpdate as EventListener);
    };
  }, [widget.device]);

  const handleSliderChange = (value: number) => {
    console.log('Slider value changed:', value);
    // Aquí implementarías la lógica para actualizar el dispositivo
  };

  const handleButtonToggle = async (newState: boolean) => {
    if (localDeviceData) {
      try {
        await deviceService.toggleRelay(localDeviceData, newState);
      } catch (error) {
        console.error('Error toggling button:', error);
      }
    }
  };

  const handleRelayToggle = async (newState: boolean) => {
    if (localDeviceData) {
      try {
        await deviceService.toggleRelay(localDeviceData, newState);
      } catch (error) {
        console.error('Error toggling relay:', error);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este widget?')) {
      onDelete(widget._id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(widget);
  };

  const isOnline = localDeviceData?.status === 'online';

  const renderWidget = () => {
    const widgetWrapper = (children: React.ReactNode) => (
      <div className={`${commonStyles.widget.container} ${
        !isOnline ? 'opacity-60' : ''
      }`}>
        <div className={commonStyles.widget.header}>
          <h3 className={commonStyles.widget.title}>{widget.title}</h3>
          <StatusIndicator isOnline={isOnline} />
        </div>
        {children}
        <div className="flex justify-end gap-2 mt-4">
          <button 
            onClick={handleEdit}
            className={`${commonStyles.button.icon} bg-blue-500 hover:bg-blue-600`}
            title="Editar widget"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className={`${commonStyles.button.icon} bg-red-500 hover:bg-red-600`}
            title="Eliminar widget"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    switch (widget.type) {
      case 'gauge':
        return widgetWrapper(
          <GaugeWidget
            value={localDeviceData?.readings?.temperature || 0}
            title={widget.title}
            min={0}
            max={100}
          />
        );
      case 'thermometer':
        const deviceId = typeof widget.device === 'object' 
          ? (widget.device as any)._id 
          : widget.device;
        
        console.log('Device data for thermometer:', {
          deviceId,
          deviceData,
          readings: deviceData?.readings,
          isOnline: deviceData?.status === 'online',
          originalDevice: widget.device
        });
        
        return widgetWrapper(
          <ThermometerWidget
            title={widget.title}
            temperature={deviceData?.readings?.temperature}
            humidity={deviceData?.readings?.humidity}
            isOnline={deviceData?.status === 'online'}
          />
        );
      case 'dht11':
        return widgetWrapper(
          <DHT11Widget
            title={widget.title}
            temperature={localDeviceData?.readings?.temperature}
            humidity={localDeviceData?.readings?.humidity}
            status={localDeviceData?.status}
          />
        );
      case 'relay':
      case 'control':
        return widgetWrapper(
          <RelayWidget
            title={widget.title}
            deviceId={widget.device || ''}
            isOn={localDeviceData?.readings?.relay || false}
            status={localDeviceData?.status}
            onToggle={handleRelayToggle}
          />
        );
      case 'button':
        const buttonDeviceId = typeof widget.device === 'object' 
          ? (widget.device as any)._id 
          : widget.device;
        
        const buttonDevice = devices.find(d => d._id === buttonDeviceId);
        
        console.log('Button widget data:', {
          widgetId: widget._id,
          deviceId: buttonDeviceId,
          deviceData: buttonDevice,
          readings: buttonDevice?.readings,
          isOnline: buttonDevice?.status === 'online',
          relay: buttonDevice?.readings?.relay
        });

        return widgetWrapper(
          <ButtonWidget
            title={widget.title}
            isOn={buttonDevice?.readings?.relay || false}
            isOnline={buttonDevice?.status === 'online'}
            onToggle={async (newState) => {
              if (buttonDevice) {
                try {
                  console.log('Toggling button to:', newState, 'for device:', buttonDevice.name);
                  await deviceService.toggleRelay(buttonDevice, newState);
                } catch (error) {
                  console.error('Error toggling button:', error);
                  alert('Error al controlar el dispositivo. Por favor, intente nuevamente.');
                }
              } else {
                console.error('No device data available for button toggle', {
                  deviceId: buttonDeviceId,
                  widget
                });
              }
            }}
          />
        );
      case 'slider':
        return widgetWrapper(
          <SliderWidget
            title={widget.title}
            value={localDeviceData?.readings?.relay ? 100 : 0}
            onChange={handleSliderChange}
          />
        );
      case 'map':
        return widgetWrapper(
          <MapWidget
            title={widget.title}
            location={localDeviceData?.location}
          />
        );
      default:
        return widgetWrapper(
          <div className="p-4 text-center text-gray-500">
            Widget type '{widget.type}' not supported
          </div>
        );
    }
  };

  return renderWidget();
}; 