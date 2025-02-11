import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export const RefreshIndicator: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      <RefreshCw 
        className={`w-5 h-5 text-gray-400 transition-transform duration-700 ${
          isRefreshing ? 'rotate-180' : ''
        }`} 
      />
    </div>
  );
}; 