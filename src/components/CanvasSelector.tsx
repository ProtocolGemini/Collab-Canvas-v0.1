import React from 'react';
import { useDrawingStore } from '../store/useDrawingStore';
import { Grid2x2 } from 'lucide-react';

const GRID_SIZE = 2;

const CanvasSelector: React.FC = () => {
  const { canvasSection, setCanvasSection, walletAddress } = useDrawingStore();

  const sections = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

  if (!walletAddress) return null;

  return (
    <div className="flex items-center gap-2">
      <Grid2x2 className="w-5 h-5 text-gray-600" />
      <div className="grid grid-cols-2 gap-1">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setCanvasSection(section)}
            className={`w-8 h-8 rounded border-2 transition-all ${
              canvasSection === section
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {section + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CanvasSelector;