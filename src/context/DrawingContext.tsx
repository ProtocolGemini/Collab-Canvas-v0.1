import React, { createContext, useContext, useState } from 'react';

interface DrawingContextType {
  color: string;
  setColor: (color: string) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [color, setColor] = useState('#000000');

  return (
    <DrawingContext.Provider value={{ color, setColor }}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};