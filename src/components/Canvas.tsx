import React, { useRef, useEffect, useState } from 'react';
import { useDrawingStore } from '../store/useDrawingStore';
import { io } from 'socket.io-client';

const GRID_SIZE = 2; // 2x2 grid for 4 users
const WEBSOCKET_URL = 'wss://your-websocket-server.com';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    color,
    walletAddress,
    canvasSection,
    socket,
    setSocket,
    addToHistory,
    historyIndex,
    drawingHistory,
  } = useDrawingStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newSocket = io(WEBSOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;
      
      // Draw grid
      ctx.strokeStyle = '#ddd';
      const cellWidth = canvas.width / GRID_SIZE;
      const cellHeight = canvas.height / GRID_SIZE;
      
      for (let i = 1; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellWidth, 0);
        ctx.lineTo(i * cellWidth, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * cellHeight);
        ctx.lineTo(canvas.width, i * cellHeight);
        ctx.stroke();
      }

      // Restore drawing history
      if (historyIndex >= 0) {
        ctx.putImageData(drawingHistory[historyIndex], 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [historyIndex, drawingHistory]);

  const isInSection = (x: number, y: number): boolean => {
    if (canvasSection === null) return false;
    
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const cellWidth = canvas.width / GRID_SIZE;
    const cellHeight = canvas.height / GRID_SIZE;
    const sectionX = canvasSection % GRID_SIZE;
    const sectionY = Math.floor(canvasSection / GRID_SIZE);

    return (
      x >= sectionX * cellWidth &&
      x < (sectionX + 1) * cellWidth &&
      y >= sectionY * cellHeight &&
      y < (sectionY + 1) * cellHeight
    );
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!walletAddress || canvasSection === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isInSection(x, y)) return;

    setIsDrawing(true);
    setLastPos({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !walletAddress || canvasSection === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isInSection(x, y)) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Emit drawing data to other users
    socket?.emit('draw', {
      from: { x: lastPos.x, y: lastPos.y },
      to: { x, y },
      color,
      section: canvasSection,
      wallet: walletAddress,
    });

    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        addToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }
    }
    setIsDrawing(false);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-[600px] bg-white rounded-lg border border-gray-200 cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
      {!walletAddress && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <p className="text-white text-lg">Please connect your wallet to start drawing</p>
        </div>
      )}
      {walletAddress && canvasSection === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <p className="text-white text-lg">Select a canvas section to start drawing</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;