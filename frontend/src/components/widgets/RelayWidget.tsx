import React from 'react';
import { Power } from 'lucide-react';

interface RelayWidgetProps {
  title: string;
  deviceId: string;
  isOn?: boolean;
  onToggle: (newState: boolean) => void;
  status?: string;
}

export const RelayWidget: React.FC<RelayWidgetProps> = ({
  title,
  isOn = false,
  onToggle,
  status
}) => {
  const isOnline = status === 'online';

  const handleClick = async () => {
    if (!isOnline) return;
    
    console.log('RelayWidget: Intentando cambiar estado a:', !isOn);
    try {
      await onToggle(!isOn);
    } catch (error) {
      console.error('Error toggling relay:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleClick}
          disabled={!isOnline}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOn 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-600 hover:bg-gray-700'
          } ${!isOnline && 'opacity-50 cursor-not-allowed'}`}
        >
          <Power className={`w-8 h-8 ${isOn ? 'text-white' : 'text-gray-300'}`} />
        </button>
        <div className="text-sm font-medium">
          {isOnline ? (
            <span className={isOn ? 'text-green-400' : 'text-gray-400'}>
              {isOn ? 'Encendido' : 'Apagado'}
            </span>
          ) : (
            <span className="text-red-400">Offline</span>
          )}
        </div>
      </div>
    </div>
  );
}; 