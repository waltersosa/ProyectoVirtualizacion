import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import { commonStyles } from '../../styles/common';

interface ThermometerWidgetProps {
  title: string;
  temperature?: number | null;
  humidity?: number | null;
  isOnline: boolean;
}

export const ThermometerWidget: React.FC<ThermometerWidgetProps> = ({
  title,
  temperature,
  humidity,
  isOnline
}) => {
  console.log('ThermometerWidget props:', { temperature, humidity, isOnline }); // Para depuración

  return (
    <div className={commonStyles.widget.reading.container}>
      <div className={commonStyles.widget.reading.item}>
        <div className={commonStyles.widget.reading.label}>
          <div className={commonStyles.widget.reading.icon.temperature}>
            <Thermometer className="w-4 h-4" />
          </div>
          <span>Temperatura</span>
        </div>
        <div className={commonStyles.widget.reading.value.temperature}>
          {isOnline && temperature !== undefined && temperature !== null 
            ? `${temperature.toFixed(1)}°C` 
            : '--'}
        </div>
      </div>
      <div className={commonStyles.widget.reading.item}>
        <div className={commonStyles.widget.reading.label}>
          <div className={commonStyles.widget.reading.icon.humidity}>
            <Droplets className="w-4 h-4" />
          </div>
          <span>Humedad</span>
        </div>
        <div className={commonStyles.widget.reading.value.humidity}>
          {isOnline && humidity !== undefined && humidity !== null 
            ? `${humidity.toFixed(1)}%` 
            : '--'}
        </div>
      </div>
    </div>
  );
}; 