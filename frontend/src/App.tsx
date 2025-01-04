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
        setDevices(loadedDevices);
        
        // Limpiar conexiones existentes antes de iniciar nuevas
        deviceService.clearAllConnections();
        
        // Iniciar conexiones WebSocket una sola vez
        loadedDevices.forEach((device: Device) => {
          if (!deviceService.websockets.has(device._id)) {
            deviceService.startPolling(device);
          }
        });
      } catch (error) {
        console.error('Error setting up devices:', error);
      }
    };

    setupDeviceConnections();

    // Limpiar conexiones al desmontar
    return () => {
      deviceService.clearAllConnections();
    };
  }, []); // Solo ejecutar una vez al iniciar la app

  useEffect(() => {
    loadWidgets();
  }, []);

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
      setWidgets(widgets.filter(widget => widget._id !== widgetId));
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

  const handleUpdateWidget = async (widgetData: Widget) => {
    try {
      // Aquí deberías tener un método en widgetService para actualizar
      const updatedWidget = await widgetService.updateWidget(widgetData);
      setWidgets(widgets.map(w => w._id === updatedWidget._id ? updatedWidget : w));
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
      </DeviceProvider>
    </ThemeProvider>
  );
}

export default App;
