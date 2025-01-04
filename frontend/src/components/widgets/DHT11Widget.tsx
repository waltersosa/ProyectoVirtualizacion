import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import { commonStyles } from '../../styles/common';
import { StatusIndicator } from '../StatusIndicator';

interface DHT11WidgetProps {
  title: string;
  temperature?: number | null;
  humidity?: number | null;
  status?: string;
}

export const DHT11Widget: React.FC<DHT11WidgetProps> = ({
  title,
  temperature,
  humidity,
  status
}) => {
  const isOnline = status === 'online';

  return (
    <div className={commonStyles.widget.container}>
      <div className={commonStyles.widget.header}>
        <h3 className={commonStyles.widget.title}>{title}</h3>
        <StatusIndicator isOnline={isOnline} />
      </div>
      <div className={commonStyles.widget.reading.container}>
        <div className={commonStyles.widget.reading.item}>
          <div className={commonStyles.widget.reading.label}>
            <div className={commonStyles.widget.reading.icon.temperature}>
              <Thermometer className="w-5 h-5" />
            </div>
            <span>Temperatura</span>
          </div>
          <span className={commonStyles.widget.reading.value.temperature}>
            {isOnline && temperature != null ? `${temperature}°C` : '--'}
          </span>
        </div>
        <div className={commonStyles.widget.reading.item}>
          <div className={commonStyles.widget.reading.label}>
            <div className={commonStyles.widget.reading.icon.humidity}>
              <Droplets className="w-5 h-5" />
            </div>
            <span>Humedad</span>
          </div>
          <span className={commonStyles.widget.reading.value.humidity}>
            {isOnline && humidity != null ? `${humidity}%` : '--'}
          </span>
        </div>
      </div>
    </div>
  );
}; 