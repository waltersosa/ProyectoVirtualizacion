export interface Device {
  _id: string;
  deviceId: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  peripherals: string[];
  ipAddress: string;
  dataVariable: string;
  readings?: {
    temperature?: number | null;
    humidity?: number | null;
    relay?: boolean;
  };
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'gauge';
  dataType?: 'temperature' | 'humidity' | 'pressure';
  controlType?: 'toggle' | 'momentary';
}

export interface Widget {
  _id: string;
  widgetId: string;
  type: string;
  title: string;
  device?: string;
  config?: WidgetConfig;
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