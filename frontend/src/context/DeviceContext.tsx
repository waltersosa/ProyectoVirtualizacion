import React, { createContext, useContext, useState, useEffect } from 'react';
import { Device } from '../types/types';
import { deviceService } from '../services/api';

interface DeviceContextType {
  devices: Device[];
  updateDevice: (deviceId: string, updates: Partial<Device>) => void;
  refreshDevices: () => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);

  const updateDevice = (deviceId: string, updates: Partial<Device>) => {
    console.log('Updating device:', deviceId, updates);
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device._id === deviceId 
          ? { ...device, ...updates, readings: { ...device.readings, ...updates.readings } }
          : device
      )
    );
  };

  const refreshDevices = async () => {
    try {
      const updatedDevices = await deviceService.getDevices();
      setDevices(updatedDevices);
    } catch (error) {
      console.error('Error refreshing devices:', error);
    }
  };

  useEffect(() => {
    refreshDevices();

    // Escuchar actualizaciones de dispositivos
    const handleDeviceUpdate = (event: CustomEvent<{ deviceId: string; updates: Partial<Device> }>) => {
      console.log('Device update event received:', event.detail);
      updateDevice(event.detail.deviceId, event.detail.updates);
    };

    window.addEventListener('deviceUpdate', handleDeviceUpdate as EventListener);

    return () => {
      window.removeEventListener('deviceUpdate', handleDeviceUpdate as EventListener);
    };
  }, []);

  return (
    <DeviceContext.Provider value={{ devices, updateDevice, refreshDevices }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
}; 