export interface Device {
  _id: string;
  deviceId: string;
  name: string;
  type: string;
  peripherals: string[];
  ipAddress: string;
  dataVariable: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
  readings: {
    temperature?: number | null;
    humidity?: number | null;
    pressure?: number | null;
    distance?: number | null;
    relay?: boolean;
    acceleration?: {
      x: number | null;
      y: number | null;
      z: number | null;
    };
  };
}

export type WidgetType = 'button' | 'thermometer';

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'gauge';
  dataType?: 'temperature' | 'humidity';
  controlType?: 'toggle' | 'momentary';
}

export interface Widget {
  _id: string;
  widgetId: string;
  type: string;
  title: string;
  device: string | { _id: string };
  config?: {
    chartType?: 'line' | 'bar' | 'gauge';
    min?: number;
    max?: number;
    unit?: string;
  };
}

// Interfaz para la creación de widgets (sin _id y widgetId que se generan después)
export interface CreateWidgetData {
  type: string;
  title: string;
  device?: string;
  config?: WidgetConfig;
}

export interface CreateDeviceData {
  name: string;
  type: string;
  peripherals: string[];
  ipAddress: string;
  dataVariable: string;
} 