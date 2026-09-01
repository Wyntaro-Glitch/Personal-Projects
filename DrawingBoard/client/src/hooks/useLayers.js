import { useState, useCallback, useRef } from 'react';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const createPaperLayer = () => ({
  id: generateId(),
  name: 'Paper',
  type: 'paper',
  visible: true,
  opacity: 1,
  blendMode: 'source-over',
  locked: true,
  clipping: false,
  alphaLock: false,
  strokes: [],
  transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
  paperColor: '#ffffff',
  paperTransparent: false
});

const createDefaultLayer = () => ({
  id: generateId(),
  name: 'Layer 1',
  type: 'stroke',
  visible: true,
  opacity: 1,
  blendMode: 'source-over',
  locked: false,
  clipping: false,
  alphaLock: false,
  strokes: [],
  transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 }
});

export default function useLayers(roomId, userId) {
  const paperLayerRef = useRef(createPaperLayer());
  const defaultLayerRef = useRef(createDefaultLayer());
  const [layers, setLayers] = useState([paperLayerRef.current, defaultLayerRef.current]);
  const [activeLayerId, setActiveLayerId] = useState(defaultLayerRef.current.id);

  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const maxHistory = 100;

  const saveSnapshot = useCallback((currentLayers) => {
    undoStackRef.current.push(structuredClone(currentLayers));
    if (undoStackRef.current.length > maxHistory) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];
  }, []);

  const isPaper = useCallback((layerId) => {
    return layers.find(l => l.id === layerId)?.type === 'paper';
  }, [layers]);

  const moveLayer = useCallback((fromId, toId) => {
    if (fromId === toId) return;
    if (isPaper(fromId) || isPaper(toId)) return;

    setLayers(prev => {
      saveSnapshot(prev);
      const fromIndex = prev.findIndex(l => l.id === fromId);
      const toIndex = prev.findIndex(l => l.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, [saveSnapshot, isPaper]);

  const createLayer = useCallback((name) => {
    const newLayer = {
      id: generateId(),
      name: name || `Layer ${layers.length}`,
      type: 'stroke',
      visible: true,
      opacity: 1,
      blendMode: 'source-over',
      locked: false,
      clipping: false,
      alphaLock: false,
      strokes: [],
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 }
    };

    setLayers(prev => {
      saveSnapshot(prev);
      const currentIdx = prev.findIndex(l => l.id === activeLayerId);
      const insertIdx = currentIdx >= 0 ? currentIdx + 1 : 1;
      const next = [...prev];
      next.splice(insertIdx, 0, newLayer);
      return next;
    });
    setActiveLayerId(newLayer.id);
    return newLayer;
  }, [activeLayerId, saveSnapshot]);

  const deleteLayer = useCallback((layerId) => {
    if (isPaper(layerId)) return false;
    if (layers.length <= 2) return false;

    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex === -1) return false;

    setLayers(prev => {
      saveSnapshot(prev);
      const next = prev.filter(l => l.id !== layerId);
      if (activeLayerId === layerId) {
        const fallbackIndex = Math.min(layerIndex, next.length - 1);
        setActiveLayerId(next[fallbackIndex]?.id || null);
      }
      return next;
    });
    return true;
  }, [layers, activeLayerId, saveSnapshot, isPaper]);

  const selectLayer = useCallback((layerId) => {
    if (isPaper(layerId)) return;
    setActiveLayerId(layerId);
  }, [isPaper]);

  const toggleVisibility = useCallback((layerId) => {
    setLayers(prev => {
      saveSnapshot(prev);
      return prev.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l);
    });
  }, [saveSnapshot]);

  const toggleLock = useCallback((layerId) => {
    if (isPaper(layerId)) return;
    setLayers(prev => {
      saveSnapshot(prev);
      return prev.map(l => l.id === layerId ? { ...l, locked: !l.locked } : l);
    });
  }, [saveSnapshot, isPaper]);

  const toggleClipping = useCallback((layerId) => {
    if (isPaper(layerId)) return;
    setLayers(prev => {
      saveSnapshot(prev);
      return prev.map(l => l.id === layerId ? { ...l, clipping: !l.clipping } : l);
    });
  }, [saveSnapshot, isPaper]);

  const toggleAlphaLock = useCallback((layerId) => {
    if (isPaper(layerId)) return;
    setLayers(prev => {
      saveSnapshot(prev);
      return prev.map(l => l.id === layerId ? { ...l, alphaLock: !l.alphaLock } : l);
    });
  }, [saveSnapshot, isPaper]);

  const renameLayer = useCallback((layerId, name) => {
    if (isPaper(layerId)) return;
    setLayers(prev => {
      saveSnapshot(prev);
      return prev.map(l => l.id === layerId ? { ...l, name } : l);
    });
  }, [saveSnapshot, isPaper]);

  const setOpacity = useCallback((layerId, opacity) => {
    setLayers(prev => {
      saveSnapshot(prev);
      return prev.map(l => l.id === layerId ? { ...l, opacity } : l);
    });
  }, [saveSnapshot]);

  const setBlendMode = useCallback((layerId, blendMode) => {
    setLayers(prev => {
      saveSnapshot(prev);
      return prev.map(l => l.id === layerId ? { ...l, blendMode } : l);
    });
  }, [saveSnapshot]);

  const setPaperColor = useCallback((color) => {
    setLayers(prev => {
      saveSnapshot(prev);
      return prev.map(l => l.type === 'paper' ? { ...l, paperColor: color, paperTransparent: false } : l);
    });
  }, [saveSnapshot]);

  const setPaperTransparent = useCallback((transparent) => {
    setLayers(prev => {
      saveSnapshot(prev);
      return prev.map(l => l.type === 'paper' ? { ...l, paperTransparent: transparent } : l);
    });
  }, [saveSnapshot]);

  const addStroke = useCallback((stroke) => {
    if (!activeLayerId) return false;

    setLayers(prev => {
      const layer = prev.find(l => l.id === activeLayerId);
      if (!layer || layer.locked || layer.type === 'paper') return prev;

      saveSnapshot(prev);
      return prev.map(l => l.id === activeLayerId
        ? { ...l, strokes: [...l.strokes, structuredClone(stroke)] }
        : l
      );
    });
    return true;
  }, [activeLayerId, saveSnapshot]);

  const clearLayer = useCallback((layerId) => {
    if (isPaper(layerId)) return;
    setLayers(prev => {
      saveSnapshot(prev);
      return prev.map(l => l.id === layerId ? { ...l, strokes: [] } : l);
    });
  }, [saveSnapshot, isPaper]);

  const duplicateLayer = useCallback((layerId) => {
    if (isPaper(layerId)) return;
    const source = layers.find(l => l.id === layerId);
    if (!source) return;

    const newLayer = {
      ...structuredClone(source),
      id: generateId(),
      name: `${source.name} Copy`,
      type: 'stroke'
    };

    const layerIndex = layers.findIndex(l => l.id === layerId);
    setLayers(prev => {
      saveSnapshot(prev);
      const next = [...prev];
      next.splice(layerIndex + 1, 0, newLayer);
      return next;
    });
    setActiveLayerId(newLayer.id);
  }, [layers, saveSnapshot, isPaper]);

  const undo = useCallback(() => {
    if (undoStackRef.current.length === 0) return false;

    setLayers(currentLayers => {
      redoStackRef.current.push(structuredClone(currentLayers));
      return undoStackRef.current.pop();
    });
    return true;
  }, []);

  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0) return false;

    setLayers(currentLayers => {
      undoStackRef.current.push(structuredClone(currentLayers));
      return redoStackRef.current.pop();
    });
    return true;
  }, []);

  const canUndo = useCallback(() => undoStackRef.current.length > 0, [layers]);
  const canRedo = useCallback(() => redoStackRef.current.length > 0, [layers]);

  const loadLayers = useCallback((roomLayers, roomActiveLayerId) => {
    if (roomLayers && roomLayers.length > 0) {
      const hasPaper = roomLayers[0]?.type === 'paper';
      if (hasPaper) {
        setLayers(roomLayers);
        setActiveLayerId(roomActiveLayerId || roomLayers[1]?.id || roomLayers[0].id);
      } else {
        const paper = createPaperLayer();
        setLayers([paper, ...roomLayers]);
        setActiveLayerId(roomActiveLayerId || roomLayers[0].id);
      }
    } else {
      const paper = createPaperLayer();
      const defaultLayer = createDefaultLayer();
      setLayers([paper, defaultLayer]);
      setActiveLayerId(defaultLayer.id);
    }
    undoStackRef.current = [];
    redoStackRef.current = [];
  }, []);

  const clearAllLayers = useCallback(() => {
    const paper = createPaperLayer();
    setLayers([paper]);
    setActiveLayerId(null);
    undoStackRef.current = [];
    redoStackRef.current = [];
  }, []);

  return {
    layers,
    activeLayerId,
    setActiveLayerId: selectLayer,
    createLayer,
    deleteLayer,
    moveLayer,
    selectLayer,
    toggleVisibility,
    toggleLock,
    toggleClipping,
    toggleAlphaLock,
    renameLayer,
    setOpacity,
    setBlendMode,
    addStroke,
    clearLayer,
    duplicateLayer,
    setPaperColor,
    setPaperTransparent,
    undo,
    redo,
    canUndo,
    canRedo,
    loadLayers,
    clearAllLayers
  };
}
