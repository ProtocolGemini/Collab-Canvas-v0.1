import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface DrawingState {
  color: string;
  walletAddress: string | null;
  canvasSection: number | null;
  isConnected: boolean;
  socket: Socket | null;
  drawingHistory: ImageData[];
  historyIndex: number;
  setColor: (color: string) => void;
  setWalletAddress: (address: string | null) => void;
  setCanvasSection: (section: number | null) => void;
  setSocket: (socket: Socket | null) => void;
  addToHistory: (imageData: ImageData) => void;
  undo: () => void;
  redo: () => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  color: '#000000',
  walletAddress: null,
  canvasSection: null,
  isConnected: false,
  socket: null,
  drawingHistory: [],
  historyIndex: -1,
  setColor: (color) => set({ color }),
  setWalletAddress: (address) => set({ walletAddress: address }),
  setCanvasSection: (section) => set({ canvasSection: section }),
  setSocket: (socket) => set({ socket, isConnected: !!socket }),
  addToHistory: (imageData) =>
    set((state) => ({
      drawingHistory: [...state.drawingHistory.slice(0, state.historyIndex + 1), imageData],
      historyIndex: state.historyIndex + 1,
    })),
  undo: () =>
    set((state) => ({
      historyIndex: Math.max(-1, state.historyIndex - 1),
    })),
  redo: () =>
    set((state) => ({
      historyIndex: Math.min(state.drawingHistory.length - 1, state.historyIndex + 1),
    })),
}));