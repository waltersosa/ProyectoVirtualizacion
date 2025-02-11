import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Settings } from './components/Settings';
import { Devices } from './components/Devices';
import { AddWidgetModal } from './components/AddWidgetModal';
import Dashboard from './components/Dashboard';
import { widgetService, deviceService } from './services/api';
import { AddDeviceModal } from './components/AddDeviceModal';
import { Device, Widget, CreateWidgetData, CreateDeviceData } from './types/types';
import { Plus } from 'lucide-react';
import { DeviceProvider } from './context/DeviceContext';
import { ThemeProvider } from './context/ThemeContext';
import { WidgetRenderer } from './components/WidgetRenderer';

function App() {
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [isEditDeviceModalOpen, setIsEditDeviceModalOpen] = useState(false);
  const [isEditWidgetModalOpen, setIsEditWidgetModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);

  useEffect(() => {
    const setupDeviceConnections = async () => {
      try {
        const loadedDevices = await deviceService.getDevices();
        if (Array.isArray(loadedDevices)) {
          setDevices(loadedDevices);
          
          // Limpiar conexiones existentes antes de iniciar nuevas
          deviceService.clearAllConnections();
          
          // Iniciar conexiones WebSocket una sola vez
          loadedDevices.forEach((device: Device) => {
            if (!deviceService.websockets.has(device._id)) {
              deviceService.startPolling(device);
            }
          });
        } else {
          console.error('Loaded devices is not an array:', loadedDevices);
        }
      } catch (error) {
        console.error('Error setting up devices:', error);
      }
    };

    setupDeviceConnections();

    return () => {
      deviceService.clearAllConnections();
    };
  }, []);

  useEffect(() => {
    loadWidgets();
  }, []);

  // Efecto para actualización automática de datos
  useEffect(() => {
    // Función para actualizar todo
    const updateAll = async () => {
      try {
        // Actualizar widgets
        const loadedWidgets = await widgetService.getWidgets();
        setWidgets(loadedWidgets);

        // Actualizar dispositivos
        const loadedDevices = await deviceService.getDevices();
        if (Array.isArray(loadedDevices)) {
          setDevices(prevDevices => {
            // Mantener las conexiones WebSocket existentes
            const updatedDevices = loadedDevices.map(newDevice => {
              const existingDevice = prevDevices.find(d => d._id === newDevice._id);
              return {
                ...newDevice,
                status: existingDevice?.status || newDevice.status,
                readings: {
                  ...existingDevice?.readings,
                  ...newDevice.readings
                }
              };
            });
            return updatedDevices;
          });
        }
      } catch (error) {
        console.error('Error updating data:', error);
      }
    };

    // Actualización inicial
    updateAll();

    // Configurar intervalo de actualización
    const updateInterval = setInterval(updateAll, 5000); // Actualizar cada 5 segundos

    // Configurar WebSocket para actualizaciones en tiempo real
    const handleDeviceUpdate = (event: CustomEvent) => {
      const { deviceId, updates } = event.detail;
      console.log('Device update received:', deviceId, updates);
      
      setDevices(prevDevices => 
        prevDevices.map(device => {
          if (device._id === deviceId) {
            console.log('Updating device:', device.name, {
              old: device.readings,
              new: updates.readings
            });
            return { 
              ...device, 
              ...updates, 
              status: updates.status || device.status,
              readings: {
                ...device.readings,
                ...updates.readings
              }
            };
          }
          return device;
        })
      );
    };

    // Suscribirse a eventos de actualización
    window.addEventListener('deviceUpdate', handleDeviceUpdate as EventListener);

    // Limpiar al desmontar
    return () => {
      clearInterval(updateInterval);
      window.removeEventListener('deviceUpdate', handleDeviceUpdate as EventListener);
      deviceService.clearAllConnections();
    };
  }, []);

  // Efecto para manejar conexiones WebSocket de dispositivos
  useEffect(() => {
    devices.forEach(device => {
      if (!deviceService.websockets.has(device._id)) {
        deviceService.startPolling(device);
      }
    });
  }, [devices]);

  const loadWidgets = async () => {
    try {
      const loadedWidgets = await widgetService.getWidgets();
      setWidgets(loadedWidgets);
    } catch (error) {
      console.error('Error loading widgets:', error);
    }
  };

  const handleDeleteWidget = async (widgetId: string) => {
    try {
      await widgetService.deleteWidget(widgetId);
      setWidgets(widgets.filter(w => w._id !== widgetId));
    } catch (error) {
      console.error('Error deleting widget:', error);
    }
  };

  const handleAddWidget = async (widgetData: CreateWidgetData) => {
    try {
      const newWidget = await widgetService.createWidget(widgetData);
      setWidgets(prevWidgets => [...prevWidgets, newWidget]);
      setIsAddWidgetModalOpen(false);
    } catch (error) {
      console.error('Error adding widget:', error);
    }
  };

  const handleAddDevice = async (deviceData: CreateDeviceData) => {
    try {
      const newDevice = await deviceService.createDevice(deviceData);
      setDevices(prevDevices => [...prevDevices, newDevice]);
      setIsAddDeviceModalOpen(false);
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setIsEditDeviceModalOpen(true);
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      await deviceService.deleteDevice(deviceId);
      setDevices(devices.filter(device => device._id !== deviceId));
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleEditWidget = (widget: Widget) => {
    setEditingWidget(widget);
    setIsEditWidgetModalOpen(true);
  };

  const handleUpdateWidget = async (updatedWidget: Widget) => {
    try {
      const result = await widgetService.updateWidget(updatedWidget);
      setWidgets(widgets.map(w => w._id === result._id ? result : w));
      setIsEditWidgetModalOpen(false);
      setEditingWidget(null);
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className="min-h-screen">
          <Sidebar />
          <main className="ml-20 p-8">
            <Dashboard 
              widgets={widgets} 
              onEditWidget={handleEditWidget}
              onDeleteWidget={handleDeleteWidget}
            />
            <button
              onClick={() => setIsAddWidgetModalOpen(true)}
              className="fixed bottom-8 right-8 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-[rgb(var(--text-primary))] rounded-lg px-4 py-2"
            >
              <Plus className="w-5 h-5" />
              Add Widget
            </button>
          </main>
        </div>
      ),
    },
    {
      path: "/devices",
      element: (
        <div className="min-h-screen">
          <Sidebar />
          <main className="ml-20 p-8">
            <Devices 
              devices={devices} 
              onAddDevice={() => setIsAddDeviceModalOpen(true)} 
              onEditDevice={handleEditDevice}
              onDeleteDevice={handleDeleteDevice}
            />
          </main>
        </div>
      ),
    },
    {
      path: "/settings",
      element: (
        <div className="min-h-screen bg-gray-900 text-white">
          <Sidebar />
          <main className="ml-20 p-8">
            <Settings />
          </main>
        </div>
      ),
    },
  ]);

  return (
    <ThemeProvider>
      <DeviceProvider>
        <div className="min-h-screen bg-gray-900">
          <RouterProvider router={router} />
          {/* Modales */}
          {isAddDeviceModalOpen && (
            <AddDeviceModal 
              isOpen={isAddDeviceModalOpen} 
              onClose={() => setIsAddDeviceModalOpen(false)} 
              onAdd={handleAddDevice} 
            />
          )}
          {isEditDeviceModalOpen && (
            <AddDeviceModal 
              isOpen={isEditDeviceModalOpen} 
              onClose={() => setIsEditDeviceModalOpen(false)} 
              onAdd={handleAddDevice} 
              deviceToEdit={editingDevice}
            />
          )}
          {isAddWidgetModalOpen && (
            <AddWidgetModal 
              isOpen={isAddWidgetModalOpen} 
              onClose={() => setIsAddWidgetModalOpen(false)} 
              onAdd={handleAddWidget}
              devices={devices} 
            />
          )}
          {isEditWidgetModalOpen && editingWidget && (
            <AddWidgetModal 
              isOpen={isEditWidgetModalOpen}
              onClose={() => {
                setIsEditWidgetModalOpen(false);
                setEditingWidget(null);
              }}
              onUpdate={handleUpdateWidget}
              devices={devices}
              widgetToEdit={editingWidget}
            />
          )}
          {/* Widgets Grid con auto-refresh */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {widgets.map(widget => (
              <WidgetRenderer
                key={widget._id}
                widget={widget}
                deviceData={devices.find(d => d._id === widget.device)}
                devices={devices}
                onEdit={handleEditWidget}
                onDelete={handleDeleteWidget}
              />
            ))}
          </div>
        </div>
      </DeviceProvider>
    </ThemeProvider>
  );
}

export default App;
