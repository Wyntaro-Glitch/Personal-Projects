// Render a single stroke
export function renderStroke(ctx, stroke) {
  if (!stroke || !stroke.points || stroke.points.length === 0) return;

  ctx.save();
  ctx.strokeStyle = stroke.color || '#000000';
  ctx.lineWidth = stroke.size || 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = stroke.opacity || 1;

  if (stroke.shape === 'rectangle' && stroke.startX !== undefined) {
    ctx.strokeRect(stroke.startX, stroke.startY, stroke.endX - stroke.startX, stroke.endY - stroke.startY);
  } else if (stroke.shape === 'circle' && stroke.startX !== undefined) {
    const centerX = (stroke.startX + stroke.endX) / 2;
    const centerY = (stroke.startY + stroke.endY) / 2;
    const radiusX = Math.abs(stroke.endX - stroke.startX) / 2;
    const radiusY = Math.abs(stroke.endY - stroke.startY) / 2;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (stroke.shape === 'line' && stroke.startX !== undefined) {
    ctx.beginPath();
    ctx.moveTo(stroke.startX, stroke.startY);
    ctx.lineTo(stroke.endX, stroke.endY);
    ctx.stroke();
  } else if (stroke.points.length > 1) {
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
  }

  ctx.restore();
}

// Render a single layer (composited onto existing canvas content)
export function renderLayer(ctx, layer, width, height) {
  if (!layer || !layer.visible) return;

  ctx.save();

  if (layer.type === 'paper') {
    if (!layer.paperTransparent) {
      ctx.globalAlpha = layer.opacity || 1;
      ctx.fillStyle = layer.paperColor || '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
    return;
  }

  // Apply layer transform
  ctx.translate(layer.transform?.x || 0, layer.transform?.y || 0);
  ctx.rotate(layer.transform?.rotation || 0);
  ctx.scale(layer.transform?.scaleX || 1, layer.transform?.scaleY || 1);

  // Apply blend mode
  ctx.globalCompositeOperation = layer.blendMode || 'source-over';

  // Apply opacity
  ctx.globalAlpha = (layer.opacity || 1);

  // Render all strokes in the layer
  if (layer.strokes) {
    for (const stroke of layer.strokes) {
      renderStroke(ctx, stroke);
    }
  }

  ctx.restore();
}

// Draw checkerboard pattern for transparent background
function drawCheckerboard(ctx, width, height) {
  const size = 10;
  ctx.save();
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      ctx.fillStyle = ((x / size + y / size) % 2 === 0) ? '#ffffff' : '#cccccc';
      ctx.fillRect(x, y, size, size);
    }
  }
  ctx.restore();
}

// Render all layers (for single canvas mode)
export function renderAllLayers(ctx, layers, width, height) {
  const paperLayer = layers.find(l => l.type === 'paper');
  const isTransparent = paperLayer?.paperTransparent || !paperLayer;

  if (isTransparent) {
    drawCheckerboard(ctx, width, height);
  }

  for (const layer of layers) {
    if (layer.visible) {
      renderLayer(ctx, layer, width, height);
    }
  }
}

// Render with clipping group support
export function renderLayerWithClipping(ctx, layer, belowLayer, width, height) {
  if (!layer || !layer.visible) return;

  ctx.save();

  // If clipping, use below layer as mask
  if (layer.clipping && belowLayer) {
    // First render the below layer content as mask
    ctx.globalCompositeOperation = 'source-over';
    renderLayer(ctx, belowLayer, width, height);
    
    // Then render current layer only where mask exists
    ctx.globalCompositeOperation = 'source-in';
    renderLayer(ctx, layer, width, height);
  } else {
    renderLayer(ctx, layer, width, height);
  }

  ctx.restore();
}
