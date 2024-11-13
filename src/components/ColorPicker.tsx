import React from 'react';
import { useDrawingStore } from '../store/useDrawingStore';

const colors = [
  '#000000', // Black
  '#ffffff', // White
  '#ff0000', // Red
  '#00ff00', // Green
  '#0000ff', // Blue
  '#ffff00', // Yellow
  '#ff00ff', // Magenta
  '#00ffff', // Cyan
];

const ColorPicker: React.FC = () => {
  const { color, setColor } = useDrawingStore();

  return (
    <div className="flex items-center gap-1">
      {colors.map((c) => (
        <button
          key={c}
          className={`w-8 h-8 rounded-full border-2 transition-transform ${
            color === c ? 'border-gray-400 scale-110' : 'border-gray-200 hover:scale-105'
          }`}
          style={{ backgroundColor: c }}
          onClick={() => setColor(c)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;