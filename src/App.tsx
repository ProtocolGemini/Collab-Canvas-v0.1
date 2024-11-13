import React from 'react';
import { Palette, Download, Undo2, Redo2, Eraser } from 'lucide-react';
import Canvas from './components/Canvas';
import ColorPicker from './components/ColorPicker';
import WalletConnect from './components/WalletConnect';
import CanvasSelector from './components/CanvasSelector';
import { useDrawingStore } from './store/useDrawingStore';

function App() {
  const { undo, redo } = useDrawingStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-semibold text-gray-800">CollabCanvas</h1>
          </div>
          <WalletConnect />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <ColorPicker />
                <div className="h-8 border-r border-gray-200"></div>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Eraser className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={undo} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Undo2 className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={redo} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Redo2 className="w-5 h-5 text-gray-600" />
                </button>
                <div className="h-8 border-r border-gray-200"></div>
                <CanvasSelector />
              </div>
              <button 
                className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const link = document.createElement('a');
                    link.download = 'collaborative-artwork.png';
                    link.href = canvas.toDataURL();
                    link.click();
                  }
                }}
              >
                <Download className="w-4 h-4" />
                Save
              </button>
            </div>
            <Canvas />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;