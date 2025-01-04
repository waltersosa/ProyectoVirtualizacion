import { Device, CreateWidgetData, Widget } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const deviceService = {
  // Obtener todos los dispositivos
  getDevices: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  },

  // Crear nuevo dispositivo con IP y variable de datos
  async createDevice(deviceData: {
    name: string;
    type: string;
    peripherals: string[];
    ipAddress: string;
    dataVariable: string;
  }) {
    try {
      const deviceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const response = await fetch(`${API_BASE_URL}/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          name: deviceData.name.trim(),
          type: deviceData.type,
          peripherals: deviceData.peripherals,
          ipAddress: deviceData.ipAddress,
          dataVariable: deviceData.dataVariable,
          status: 'offline',
          readings: {
            temperature: null,
            humidity: null,
            pressure: null,
            distance: null,
            acceleration: { x: null, y: null, z: null }
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el dispositivo');
      }

      return data;
    } catch (error) {
      console.error('Error creating device:', error);
      throw error;
    }
  },

  // Actualizar dispositivo
  async updateDevice(id: string, deviceData: {
    name: string;
    type: string;
    peripherals: string[];
  }) {
    try {
      // Verificar si ya existe otro dispositivo con el mismo nombre (excluyendo el actual)
      const devices = await this.getDevices();
      const cleanedName = deviceData.name.trim().toLowerCase(); // Limpia y convierte a minúsculas
      const existingDevice = devices.find((device: Device) => 
        device.name.trim().toLowerCase() === cleanedName && device._id !== id
      );
      if (existingDevice) {
        throw new Error('Un dispositivo con ese nombre ya existe');
      }

      const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  },

  // Eliminar dispositivo
  async deleteDevice(id: string) {
    const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting device');
    }
    return true;
  },

  websockets: new Map<string, WebSocket>(),
  reconnectAttempts: new Map<string, number>(),
  maxReconnectAttempts: 5,
  reconnectTimeout: 2000,

  // Obtener datos en tiempo real del dispositivo
  async getDeviceData(device: Device) {
    const setupWebSocket = () => {
      try {
        // Limpiar conexión existente
        this.cleanupWebSocket(device._id);

        const ws = new WebSocket(`ws://${device.ipAddress}/ws`);
        const isIntentionalClose = false;

        ws.onopen = async () => {
          console.log(`WebSocket conectado para ${device.name}`);
          this.reconnectAttempts.set(device._id, 0);
          
          // Enviar estado inicial del relé
          if (device.readings?.relay !== undefined) {
            this.toggleRelay(device, device.readings.relay).catch(console.error);
          }
        };

        ws.onclose = async (event) => {
          console.log(`WebSocket cerrado para ${device.name}`, event.code, event.reason);
          
          if (!isIntentionalClose) {
            const attempts = (this.reconnectAttempts.get(device._id) || 0) + 1;
            
            if (attempts <= this.maxReconnectAttempts) {
              console.log(`Intento de reconexión ${attempts}/${this.maxReconnectAttempts}`);
              this.reconnectAttempts.set(device._id, attempts);
              setTimeout(() => this.getDeviceData(device), this.reconnectTimeout);
            } else {
              console.log(`Máximo de intentos alcanzado para ${device.name}`);
              await this.updateDeviceReadings(device._id, {
                readings: { ...device.readings, relay: false },
                status: 'offline',
                lastSeen: new Date()
              });
            }
          }
          
          this.websockets.delete(device._id);
        };

        ws.onerror = (error) => {
          console.error(`Error WebSocket para ${device.name}:`, error);
        };

        ws.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket data:', data);
          
          const updates = {
            readings: {
              temperature: data.temperature,
              humidity: data.humidity,
              relay: data.relay
            },
            status: data.status || 'online',
            lastSeen: new Date()
          };

          await this.updateDeviceReadings(device._id, updates);
          window.dispatchEvent(new CustomEvent('deviceUpdate', {
            detail: { deviceId: device._id, updates }
          }));
        };

        this.websockets.set(device._id, ws);
        return ws;
      } catch (error) {
        console.error(`Error configurando WebSocket para ${device.name}:`, error);
        throw error;
      }
    };

    return setupWebSocket();
  },

  cleanupWebSocket(deviceId: string) {
    const existingWs = this.websockets.get(deviceId);
    if (existingWs) {
      if (existingWs.readyState === WebSocket.OPEN || existingWs.readyState === WebSocket.CONNECTING) {
        existingWs.close(1000, 'Cleanup');
      }
      this.websockets.delete(deviceId);
    }
  },

  // Actualizar lecturas del dispositivo
  async updateDeviceReadings(id: string, data: { 
    readings: { 
      temperature?: number | null;
      humidity?: number | null;
      pressure?: number | null;
      distance?: number | null;
      acceleration?: {
        x: number | null;
        y: number | null;
        z: number | null;
      };
      relay?: boolean;
    }; 
    status: string; 
    lastSeen: Date; 
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/${id}/readings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error actualizando lecturas del dispositivo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating device readings:', error);
      throw error;
    }
  },

  // Iniciar polling de datos para un dispositivo
  startPolling(device: Device) {
    console.log(`Starting polling for device: ${device.name}`);
    
    // Si ya existe una conexión WebSocket activa, no crear otra
    if (this.websockets.has(device._id) && 
        this.websockets.get(device._id)?.readyState === WebSocket.OPEN) {
      console.log(`WebSocket connection already exists for ${device.name}`);
      return;
    }

    // Iniciar una única conexión WebSocket
    this.getDeviceData(device).catch(error => {
      console.error(`Error initializing WebSocket for ${device.name}:`, error);
    });
  },

  // Detener polling para un dispositivo
  stopPolling(deviceId: string) {
    const activePolls = JSON.parse(localStorage.getItem('activePolls') || '{}');
    if (activePolls[deviceId]) {
      clearInterval(activePolls[deviceId]);
      delete activePolls[deviceId];
      localStorage.setItem('activePolls', JSON.stringify(activePolls));
    }
  },

  // Limpiar todos los pollings activos
  clearAllPollings() {
    console.log('Clearing all connections...');
    this.clearAllConnections();
    
    // Limpiar los intervalos de ping
    const activePolls = JSON.parse(localStorage.getItem('activePolls') || '{}');
    Object.values(activePolls).forEach((interval) => clearInterval(interval as NodeJS.Timeout));
    localStorage.removeItem('activePolls');
  },

  // Limpiar conexiones WebSocket
  clearAllConnections() {
    console.log('Limpiando todas las conexiones...');
    this.websockets.forEach((_, deviceId) => {
      this.cleanupWebSocket(deviceId);
    });
    this.reconnectAttempts.clear();
  },

  async toggleRelay(device: Device, state: boolean) {
    console.log('API Service: Intentando enviar comando de relé', {
      device: device.name,
      state: state,
      wsExists: this.websockets.has(device._id),
      wsState: this.websockets.get(device._id)?.readyState
    });

    const ws = this.websockets.get(device._id);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error(`No hay conexión WebSocket activa para ${device.name}`);
      throw new Error('No hay conexión con el dispositivo');
    }

    try {
      const message = { relay: state };
      console.log('Enviando mensaje WebSocket:', JSON.stringify(message));
      ws.send(JSON.stringify(message));

      // Actualizar el estado localmente sin esperar confirmación
      const updates = {
        readings: {
          ...device.readings,
          relay: state
        },
        status: 'online',
        lastSeen: new Date()
      };

      await this.updateDeviceReadings(device._id, updates);
      window.dispatchEvent(new CustomEvent('deviceUpdate', {
        detail: { deviceId: device._id, updates }
      }));

      return true;
    } catch (error) {
      console.error('Error toggling relay:', error);
      throw error;
    }
  }
};

export const widgetService = {
  // Obtener todos los widgets
  getWidgets: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/widgets`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching widgets:', error);
      throw error;
    }
  },

  // Crear nuevo widget
  createWidget: async (widgetData: CreateWidgetData) => {
    try {
      if (!widgetData.type) {
        throw new Error('El tipo de widget es requerido');
      }

      const widgetId = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const response = await fetch(`${API_BASE_URL}/widgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          widgetId,
          type: widgetData.type,
          title: widgetData.title.trim(),
          device: widgetData.device,
          config: widgetData.config
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el widget');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating widget:', error);
      throw error;
    }
  },

  // Eliminar widget
  deleteWidget: async (widgetId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/widgets/${widgetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error deleting widget:', error);
      throw error;
    }
  },

  // Actualizar widget
  updateWidget: async (widgetData: Widget) => {
    try {
      const response = await fetch(`${API_BASE_URL}/widgets/${widgetData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(widgetData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating widget:', error);
      throw error;
    }
  },
};
