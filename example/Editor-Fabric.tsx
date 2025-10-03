
import * as fabric from 'fabric';
import React, { useRef, useEffect } from 'react';

export const Editor = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(()=>{
    if( !canvasRef.current ) return;
    const canvasWidth = 800;
    const canvasHeight = 600;
    const fabricCanvas = new fabric.Canvas( canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#fff',
      isDrawingMode: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      renderOnAddRemove: true,
      selection: false
    });
    fabricRef.current = fabricCanvas;

    // 配置笔刷
    const brush = new fabric.PencilBrush(fabricCanvas);
    brush.color = '#000000';
    brush.width = 20;
    brush.strokeLineCap = 'round';
    brush.strokeLineJoin = 'round';
    brush.strokeMiterLimit = 4;
    brush.decimate = 2;
    brush.limitedToCanvasSize = true;

    // 笔刷生效
    fabricCanvas.freeDrawingBrush = brush;

    // 加载图片
    fabric.FabricImage.fromURL('/public/example/001.png', { crossOrigin: 'anonymous' }).then(img => {
      // 计算缩放比例（最大边撑满）
      const imageWidth = img.width!;
      const imageHeight = img.height!;
      const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        // // 缩放尺寸，但是不要变形
        // scaleX: fabricCanvas.width! / img.width!,
        // scaleY: fabricCanvas.height! / img.height!,
      });
      img.scale(scale);
      // fabricCanvas.add(img);
      fabricCanvas.sendObjectToBack(img);
      fabricCanvas.renderAll();
    });

    const exportCanvas = new fabric.StaticCanvas(null, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#fff',
      enableRetinaScaling: true,
    });
  }, [])

  return (
    <div className='editor-container'>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }}></canvas>
      <div>
        <button onClick={()=>{
          if( !fabricRef.current ) return;
          // fabricRef.current.isDrawingMode = true;
          fabricRef.current.toBlob({
            format: "png",
            multiplier: 1
          }).then(blob => {
            if( !blob ) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'canvas.png';
            a.click();
            URL.revokeObjectURL(url);
          });
        }}>导出图片</button>
      </div>
    </div>
  )
}