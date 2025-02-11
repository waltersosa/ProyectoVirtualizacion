import { Device, CreateWidgetData, Widget } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Función helper para verificar la conexión
const checkApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
};

// Función helper para manejar errores de fetch
const handleFetchError = (error: any, endpoint: string) => {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    console.error(`Connection error to ${endpoint}. Please check if the backend server is running.`);
    throw new Error(`Unable to connect to the server. Please ensure the backend is running at ${API_BASE_URL}`);
  }
  throw error;
};

export const deviceService = {
  // Obtener todos los dispositivos
  getDevices: async () => {
    try {
      const isConnected = await checkApiConnection();
      if (!isConnected) {
        throw new Error('Backend server is not available');
      }

      const response = await fetch(`${API_BASE_URL}/devices`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const jsonResponse = await response.json();
      return jsonResponse.data;
    } catch (error) {
      handleFetchError(error, 'devices');
      throw error;
    }
  },

  // Crear nuevo dispositivo con IP y variable de datos
  createDevice: async (deviceData: {
    name: string;
    type: string;
    peripherals: string[];
    ipAddress: string;
    dataVariable: string;
  }) => {
    try {
      const isConnected = await checkApiConnection();
      if (!isConnected) {
        throw new Error('Backend server is not available');
      }

      const deviceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const response = await fetch(`${API_BASE_URL}/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          ...deviceData,
          status: 'offline',
          readings: {
            temperature: null,
            humidity: null,
            pressure: null,
            distance: null,
            acceleration: { x: null, y: null, z: null },
            relay: false
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el dispositivo');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating device:', error);
      handleFetchError(error, 'devices');
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
  deleteDevice: async (deviceId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Cerrar la conexión WebSocket si existe
      deviceService.stopPolling(deviceId);
      
      return true;
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  },

  websockets: new Map<string, WebSocket>(),
  reconnectAttempts: new Map<string, number>(),
  maxReconnectAttempts: 5,
  reconnectTimeout: 2000,

  // Obtener datos en tiempo real del dispositivo
  async getDeviceData(device: Device) {
    const setupWebSocket = () => {
      try {
        this.cleanupWebSocket(device._id);

        if (!device.ipAddress) {
          throw new Error('IP address is missing');
        }

        const wsUrl = `ws://${device.ipAddress}:81/ws`;
        console.log(`Intentando conexión WebSocket a: ${wsUrl}`);

        const ws = new WebSocket(wsUrl);
        let isIntentionalClose = false;
        let connectionTimeout: NodeJS.Timeout;

        // Timeout más largo para la conexión inicial
        connectionTimeout = setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            console.log('Timeout de conexión, cerrando socket');
            isIntentionalClose = true;
            ws.close();
          }
        }, 10000); // 10 segundos de timeout

        ws.onopen = async () => {
          clearTimeout(connectionTimeout);
          console.log(`WebSocket conectado para ${device.name}`);
          this.reconnectAttempts.set(device._id, 0);
          
          // Esperar un momento antes de enviar el estado inicial
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          try {
            // Actualizar estado del dispositivo
            await this.updateDeviceReadings(device._id, {
              status: 'online',
              lastSeen: new Date(),
              readings: device.readings
            });
          } catch (error) {
            console.error('Error actualizando estado inicial:', error);
          }
        };

        ws.onclose = async (event) => {
          clearTimeout(connectionTimeout);
          console.log(`WebSocket cerrado para ${device.name}`, event.code);
          
          if (!isIntentionalClose) {
            const attempts = (this.reconnectAttempts.get(device._id) || 0) + 1;
            
            if (attempts <= this.maxReconnectAttempts) {
              console.log(`Intento de reconexión ${attempts}/${this.maxReconnectAttempts}`);
              this.reconnectAttempts.set(device._id, attempts);
              
              const timeout = this.reconnectTimeout * Math.pow(2, attempts - 1);
              setTimeout(() => {
                if (!this.websockets.has(device._id)) {
                  console.log(`Intentando reconexión para ${device.name}`);
                  this.getDeviceData(device).catch(console.error);
                }
              }, timeout);
            } else {
              console.log(`Máximo de intentos alcanzado para ${device.name}`);
              await this.updateDeviceReadings(device._id, {
                status: 'offline',
                lastSeen: new Date()
              });
              
              // Resetear intentos después de un tiempo
              setTimeout(() => {
                this.reconnectAttempts.set(device._id, 0);
              }, 30000);
            }
          }
          
          this.websockets.delete(device._id);
        };

        ws.onerror = (error) => {
          console.error(`Error WebSocket para ${device.name}:`, error);
          if (ws.readyState === WebSocket.OPEN) {
            isIntentionalClose = true;
            ws.close();
          }
        };

        ws.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log(`Datos recibidos de ${device.name}:`, data);
            
            // Asegurarse de que los datos sean números
            const temperature = typeof data.temperature === 'string' 
              ? parseFloat(data.temperature) 
              : data.temperature;
            
            const humidity = typeof data.humidity === 'string'
              ? parseFloat(data.humidity)
              : data.humidity;

            const updates = {
              readings: {
                temperature,
                humidity,
                relay: data.relay
              },
              status: 'online',
              lastSeen: new Date()
            };

            console.log('Actualizando dispositivo con:', {
              deviceId: device._id,
              updates,
              currentReadings: device.readings
            });

            await this.updateDeviceReadings(device._id, updates);
            
            // Disparar evento con los datos actualizados
            window.dispatchEvent(new CustomEvent('deviceUpdate', {
              detail: { 
                deviceId: device._id, 
                updates: {
                  ...updates,
                  _id: device._id,
                  name: device.name
                }
              }
            }));
          } catch (error) {
            console.error('Error procesando mensaje:', error);
          }
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
      try {
        if (existingWs.readyState === WebSocket.OPEN || existingWs.readyState === WebSocket.CONNECTING) {
          existingWs.close(1000, 'Cleanup');
        }
      } catch (error) {
        console.warn('Error closing WebSocket:', error);
      } finally {
        this.websockets.delete(deviceId);
      }
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
      // Marcar el dispositivo como offline si hay error
      this.updateDeviceReadings(device._id, {
        readings: { ...device.readings },
        status: 'offline',
        lastSeen: new Date()
      }).catch(console.error);
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
      deviceName: device.name,
      deviceId: device._id,
      currentState: device.readings?.relay,
      newState: state,
      wsExists: this.websockets.has(device._id),
      wsState: this.websockets.get(device._id)?.readyState
    });

    // Si no hay conexión WebSocket, intentar establecerla
    if (!this.websockets.has(device._id)) {
      try {
        await this.getDeviceData(device);
        // Esperar a que la conexión se establezca
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error al conectar con el dispositivo:', error);
        throw new Error('No se pudo establecer conexión con el dispositivo');
      }
    }

    const ws = this.websockets.get(device._id);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error(`No hay conexión WebSocket activa para ${device.name}`);
      throw new Error('No hay conexión con el dispositivo');
    }

    return new Promise((resolve, reject) => {
      try {
        const message = JSON.stringify({ relay: state });
        console.log('Enviando mensaje WebSocket:', message);
        
        const timeout = setTimeout(() => {
          reject(new Error('Timeout esperando respuesta del dispositivo'));
        }, 5000);

        const handleResponse = (event: MessageEvent) => {
          try {
            const response = JSON.parse(event.data);
            console.log('Respuesta recibida del dispositivo:', {
              deviceName: device.name,
              response
            });
            
            if (response.relay !== undefined) {
              clearTimeout(timeout);
              ws.removeEventListener('message', handleResponse);
              
              const updates = {
                readings: {
                  ...device.readings,
                  relay: response.relay
                },
                status: 'online',
                lastSeen: new Date()
              };

              this.updateDeviceReadings(device._id, updates)
                .then(() => {
                  window.dispatchEvent(new CustomEvent('deviceUpdate', {
                    detail: { 
                      deviceId: device._id, 
                      updates: {
                        ...updates,
                        _id: device._id,
                        name: device.name
                      }
                    }
                  }));
                  resolve(response.relay);
                })
                .catch(reject);
            }
          } catch (error) {
            console.error('Error procesando respuesta:', error);
            reject(error);
          }
        };

        ws.addEventListener('message', handleResponse);
        ws.send(message);
      } catch (error) {
        console.error('Error enviando comando:', error);
        reject(error);
      }
    });
  }
};

export const widgetService = {
  // Obtener todos los widgets
  getWidgets: async () => {
    try {
      const isConnected = await checkApiConnection();
      if (!isConnected) {
        throw new Error('Backend server is not available');
      }

      const response = await fetch(`${API_BASE_URL}/widgets`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const jsonResponse = await response.json();
      return jsonResponse.data || []; // Asegurarse de devolver un array vacío si no hay datos
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

      // Normalizar el deviceId
      const deviceId = typeof widgetData.device === 'object'
        ? (widgetData.device as any)._id
        : widgetData.device;

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
          device: deviceId,
          config: widgetData.config || {}
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el widget');
      }

      const data = await response.json();
      return data.data;
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
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating widget:', error);
      throw error;
    }
  },
};
