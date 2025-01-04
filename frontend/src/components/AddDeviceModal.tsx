import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Device } from '../types/types';

import { exampleCode as dht11Code } from "../examples/dht11";
import { exampleCode as bmp180Code } from "../examples/bmp180";
import { exampleCode as relayCode } from "../examples/relay";
import { exampleCode as hcsr04Code } from "../examples/hc-sr04";
import { exampleCode as mpu6050Code } from "../examples/mpu6050";

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (deviceData: { 
    name: string; 
    type: string; 
    peripherals: string[]; 
    ipAddress: string;
    dataVariable: string;
  }) => void;
  deviceToEdit?: Device | null;
}

const peripheralExamples = {
  "DHT11 (Temperature & Humidity)": {
    image: "/assets/connections/ESP32/dht11-esp32.png",
    imageESP8266: "/assets/connections/ESP8266/dht11-esp8266.png",
    code: dht11Code
  },
  "BMP180 (Barometric Pressure)": {
    image: "/assets/connections/ESP32/bmp180-esp32.png",
    imageESP8266: "/assets/connections/ESP8266/bmp180-esp8266.png",
    code: bmp180Code
  },
  "HC-SR04 (Ultrasonic)": {
    image: "/assets/connections/ESP32/hc-sr04-esp32.png",
    imageESP8266: "/assets/connections/ESP8266/hc-sr04-esp8266.png",
    code: hcsr04Code
  },
  "MPU6050 (Accelerometer)": {
    image: "/assets/connections/ESP32/mpu6050-esp32.png",
    imageESP8266: "/assets/connections/ESP8266/mpu6050-esp8266.png",
    code: mpu6050Code
  },
  "Relay Module": {
    image: "/assets/connections/ESP32/relay-esp32.png",
    imageESP8266: "/assets/connections/ESP8266/relay-esp8266.png",
    code: relayCode
  }
};

type PeripheralKey = keyof typeof peripheralExamples;

export function AddDeviceModal({ isOpen, onClose, onAdd, deviceToEdit }: AddDeviceModalProps) {
  const [deviceData, setDeviceData] = useState({
    name: deviceToEdit ? deviceToEdit.name : '',
    type: deviceToEdit ? deviceToEdit.type : 'ESP32',
    peripherals: deviceToEdit ? deviceToEdit.peripherals : [],
    ipAddress: deviceToEdit ? deviceToEdit.ipAddress : '',
    dataVariable: deviceToEdit ? deviceToEdit.dataVariable : 'data'
  });
  const [selectedPeripheral, setSelectedPeripheral] = useState<PeripheralKey | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setDeviceData({
        name: deviceToEdit ? deviceToEdit.name : '',
        type: deviceToEdit ? deviceToEdit.type : 'ESP32',
        peripherals: deviceToEdit ? deviceToEdit.peripherals : [],
        ipAddress: deviceToEdit ? deviceToEdit.ipAddress : '',
        dataVariable: deviceToEdit ? deviceToEdit.dataVariable : 'data'
      });
      setSelectedPeripheral("");
    }
  }, [isOpen, deviceToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onAdd(deviceData);
      setDeviceData({
        name: '',
        type: 'ESP32',
        peripherals: [],
        ipAddress: '',
        dataVariable: 'data'
      });
      setSelectedPeripheral("");
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error inesperado al procesar el dispositivo');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPeripheral = () => {
    if (!selectedPeripheral) return;
    setDeviceData((prev) => ({
      ...prev,
      peripherals: [...prev.peripherals, selectedPeripheral],
    }));
    setSelectedPeripheral("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-white">Add New Device</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="deviceName" className="block text-sm font-medium text-gray-300 mb-2">
              Device Name
            </label>
            <input
              id="deviceName"
              name="deviceName"
              type="text"
              value={deviceData.name}
              onChange={(e) => setDeviceData({ ...deviceData, name: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="deviceType" className="block text-sm font-medium text-gray-300 mb-2">
              Device Type
            </label>
            <select
              id="deviceType"
              name="deviceType"
              value={deviceData.type}
              onChange={(e) => setDeviceData({ ...deviceData, type: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              required
            >
              <option value="">Select a type</option>
              <option value="ESP32">ESP32</option>
              <option value="ESP8266">ESP8266</option>
            </select>
          </div>

          <div>
            <label htmlFor="peripherals" className="block text-sm font-medium text-gray-300 mb-2">
              Peripherals
            </label>
            <div className="flex gap-2">
              <select
                id="peripherals"
                name="peripherals"
                value={selectedPeripheral}
                onChange={(e) => setSelectedPeripheral(e.target.value as PeripheralKey)}
                className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Select a peripheral</option>
                {Object.keys(peripheralExamples).map(peripheral => (
                  <option key={peripheral} value={peripheral}>
                    {peripheral}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddPeripheral}
                disabled={!selectedPeripheral}
                className={`px-4 py-2 rounded-lg ${
                  selectedPeripheral 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Add
              </button>
            </div>
          </div>

          {deviceData.peripherals.length > 0 && (
            <div className="max-h-32 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-300 mb-1">
                Selected Peripherals
              </h3>
              <ul className="list-disc pl-5 text-gray-300">
                {deviceData.peripherals.map((peripheral) => (
                  <li key={peripheral}>
                    {peripheral}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedPeripheral && peripheralExamples[selectedPeripheral] && (
            <div className="mt-4 space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Connection Diagram
                </h3>
                <img 
                  src={deviceData.type === "ESP32" 
                    ? peripheralExamples[selectedPeripheral].image 
                    : peripheralExamples[selectedPeripheral].imageESP8266}
                  alt={`${selectedPeripheral} connection for ${deviceData.type}`}
                  className="w-full max-h-24 object-contain mb-2"
                />
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Example Code
                </h3>
                <div className="overflow-x-auto bg-gray-900 p-2 rounded-lg max-h-32">
                  <pre className="break-words">
                    <code className="text-sm text-gray-300">
                      {peripheralExamples[selectedPeripheral].code}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-300 mb-2">
              IP del Dispositivo
            </label>
            <input
              id="ipAddress"
              type="text"
              value={deviceData.ipAddress}
              onChange={(e) => setDeviceData({ ...deviceData, ipAddress: e.target.value })}
              placeholder="192.168.1.100"
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Ejemplo: 192.168.1.100 (IP local del ESP32)
            </p>
          </div>

          <div>
            <label htmlFor="dataVariable" className="block text-sm font-medium text-gray-300 mb-2">
              Variable de Datos
            </label>
            <input
              id="dataVariable"
              type="text"
              value={deviceData.dataVariable}
              onChange={(e) => setDeviceData({ ...deviceData, dataVariable: e.target.value })}
              placeholder="data"
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Nombre de la ruta para obtener datos (ejemplo: data, sensor, readings)
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting 
                ? 'bg-blue-500/50 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-lg px-4 py-1`}
          >
            {isSubmitting 
              ? 'Procesando...' 
              : deviceToEdit 
                ? 'Actualizar Dispositivo' 
                : 'Agregar Dispositivo'}
          </button>
        </form>
      </div>
    </div>
  );
}
