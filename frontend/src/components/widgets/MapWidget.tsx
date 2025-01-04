import React from 'react';

interface MapWidgetProps {
  title: string;
  location?: { lat: number; lng: number };
}

export const MapWidget: React.FC<MapWidgetProps> = ({ title, location }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="bg-gray-700 rounded-lg h-40 flex items-center justify-center">
        {location ? (
          <p className="text-gray-400">
            Lat: {location.lat}, Lng: {location.lng}
          </p>
        ) : (
          <p className="text-gray-400">No location data</p>
        )}
      </div>
    </div>
  );
}; 