import React from 'react';
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
  onEdit: (widget: Widget) => void;
  onDelete: (widgetId: string) => void;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ 
  widget, 
  deviceData,
  onEdit,
  onDelete
}) => {
  const handleSliderChange = (value: number) => {
    console.log('Slider value changed:', value);
    // Aquí implementarías la lógica para actualizar el dispositivo
  };

  const handleButtonToggle = (newState: boolean) => {
    console.log(`Device ${widget.device} toggled to: ${newState}`);
    // Aquí implementarías la lógica para actualizar el estado del dispositivo
  };

  const handleRelayToggle = async (newState: boolean) => {
    if (deviceData) {
      try {
        console.log('WidgetRenderer: Enviando comando al dispositivo:', {
          device: deviceData.name,
          newState: newState
        });
        
        // Mantener las lecturas actuales
        const currentReadings = { ...deviceData.readings };

        await deviceService.toggleRelay(deviceData, newState);
        
        // Actualizar el estado localmente
        if (deviceData._id) {
          const updateEvent = new CustomEvent('deviceUpdate', {
            detail: {
              deviceId: deviceData._id,
              updates: {
                readings: {
                  ...currentReadings, // Mantener las lecturas actuales
                  relay: newState
                },
                status: deviceData.status,
                lastSeen: new Date()
              }
            }
          });
          window.dispatchEvent(updateEvent);
        }
      } catch (error) {
        console.error('Error toggling relay:', error);
      }
    } else {
      console.error('No device data available');
    }
  };

  const isOnline = deviceData?.status === 'online';

  const renderWidget = () => {
    const widgetWrapper = (children: React.ReactNode) => (
      <div className={commonStyles.widget.container}>
        <div className={commonStyles.widget.header}>
          <h3 className={commonStyles.widget.title}>{widget.title}</h3>
          <StatusIndicator isOnline={isOnline} />
        </div>
        {children}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => onEdit(widget)} className={commonStyles.widget.button.edit}>
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(widget._id)} className={commonStyles.widget.button.delete}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    switch (widget.type) {
      case 'gauge':
        return widgetWrapper(
          <GaugeWidget
            value={deviceData?.readings?.temperature || 0}
            title={widget.title}
            min={0}
            max={100}
          />
        );
      case 'thermometer':
        return widgetWrapper(
          <ThermometerWidget
            title={widget.title}
            deviceId={widget.device || ''}
            readings={deviceData?.readings}
            status={deviceData?.status}
          />
        );
      case 'slider':
        return widgetWrapper(
          <SliderWidget
            title={widget.title}
            value={deviceData?.value}
            onChange={handleSliderChange}
          />
        );
      case 'map':
        return widgetWrapper(
          <MapWidget
            title={widget.title}
            location={deviceData?.location}
          />
        );
      case 'button':
        return widgetWrapper(
          <ButtonWidget
            title={widget.title}
            deviceId={widget.device}
            onToggle={handleButtonToggle}
          />
        );
      case 'relay':
        return widgetWrapper(
          <RelayWidget
            title={widget.title}
            deviceId={widget.device || ''}
            isOn={deviceData?.readings?.relay || false}
            status={deviceData?.status}
            onToggle={handleRelayToggle}
          />
        );
      case 'control':
        return widgetWrapper(
          <ButtonWidget
            title={widget.title}
            deviceId={widget.device || ''}
            isOn={deviceData?.readings?.relay || false}
            status={deviceData?.status}
            onToggle={handleRelayToggle}
          />
        );
      case 'dht11':
        return widgetWrapper(
          <DHT11Widget
            title={widget.title}
            temperature={deviceData?.readings?.temperature}
            humidity={deviceData?.readings?.humidity}
            status={deviceData?.status}
          />
        );
      default:
        return widgetWrapper(
          <div>No widget type supported</div>
        );
    }
  };

  return renderWidget();
}; 