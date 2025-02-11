import React, { useState, useEffect } from 'react';
import { Power } from 'lucide-react';

interface ButtonWidgetProps {
  title: string;
  isOn: boolean;
  isOnline: boolean;
  onToggle: (newState: boolean) => Promise<void>;
}

export const ButtonWidget: React.FC<ButtonWidgetProps> = ({
  title,
  isOn,
  isOnline,
  onToggle
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localIsOn, setLocalIsOn] = useState(isOn);

  // Actualizar el estado local cuando cambia el prop
  useEffect(() => {
    setLocalIsOn(isOn);
  }, [isOn]);

  const handleClick = async () => {
    if (!isOnline || isLoading) return;
    
    setIsLoading(true);
    try {
      const newState = !localIsOn;
      await onToggle(newState);
      setLocalIsOn(newState);
    } catch (error) {
      console.error('Error toggling button:', error);
      // Revertir el estado local si hay error
      setLocalIsOn(isOn);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        disabled={!isOnline || isLoading}
        className={`
          w-16 h-16 rounded-full 
          flex items-center justify-center
          transition-all duration-300
          ${localIsOn 
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' 
            : 'bg-gray-700 text-gray-400'
          }
          ${isOnline && !isLoading
            ? 'hover:scale-110 active:scale-95 cursor-pointer' 
            : 'opacity-50 cursor-not-allowed'
          }
          ${isLoading ? 'animate-pulse' : ''}
        `}
        title={`${isOnline ? (localIsOn ? 'Apagar' : 'Encender') : 'Dispositivo desconectado'}`}
      >
        <Power className={`w-8 h-8 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
      <span className="text-sm text-gray-400">
        {isLoading 
          ? 'Actualizando...'
          : isOnline 
            ? (localIsOn ? 'Encendido' : 'Apagado') 
            : 'Desconectado'
        }
      </span>
    </div>
  );
}; 