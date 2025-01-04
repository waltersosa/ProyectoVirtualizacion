import React from 'react';
import { Power, Edit, Trash2 } from 'lucide-react';
import { commonStyles } from '../../styles/common';

interface ButtonWidgetProps {
  title: string;
  deviceId: string;
  isOn?: boolean;
  status?: string;
  onToggle: (newState: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ButtonWidget: React.FC<ButtonWidgetProps> = ({
  title,
  isOn = false,
  status,
  onToggle
}) => {
  const isOnline = status === 'online';

  return (
    <div className={commonStyles.widget.container}>
      <div className={commonStyles.widget.header}>
        <h3 className={commonStyles.widget.title}>{title}</h3>
      </div>
      <div className={commonStyles.widget.button.container}>
        <button
          onClick={() => isOnline && onToggle(!isOn)}
          disabled={!isOnline}
          className={`${commonStyles.widget.button.power} ${
            isOn ? commonStyles.widget.button.powerOn : commonStyles.widget.button.powerOff
          }`}
        >
          <Power className="w-10 h-10" />
        </button>
        <span className={commonStyles.widget.button.label}>
          {isOn ? 'Encendido' : 'Apagado'}
        </span>
      </div>
    </div>
  );
}; 