import React from 'react';
import { commonStyles } from '../styles/common';

interface StatusIndicatorProps {
  isOnline: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isOnline, className = "" }) => {
  return (
    <div className={`${isOnline ? commonStyles.status.online : commonStyles.status.offline} ${className}`}>
      <div className={`
        ${commonStyles.status.dot.base}
        ${isOnline ? commonStyles.status.dot.online : commonStyles.status.dot.offline}
      `} />
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
}; 