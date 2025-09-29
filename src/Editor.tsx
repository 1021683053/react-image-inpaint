
import React, { useRef, useEffect, useCallback } from 'react';
import { App, Group, Leafer, Pen, DragEvent, Image, Rect, Frame, ImageEvent } from 'leafer-ui'
import '@leafer-in/editor' // 导入图形编辑器插件  
import '@leafer-in/viewport'
import '@leafer-in/view'
import '@leafer-in/export' 
import { Segmented } from 'antd';

export const Editor = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const leaferRef = useRef<Leafer | null>(null);
  const maskRef = useRef<Rect | null>(null);

  const cursorRef = useRef<Pen | null >(null);

  const [mode, setMode] = React.useState<'Brush' | 'Eraser' | 'None'>('None');

  useEffect(()=>{
    if( !canvasRef.current ) return;

    const leafer = new Leafer({
      view: canvasRef.current, // view 参数支持设置 window 对象
      width: 800,
      height: 600,
      type: 'design',
      fill: '#333'
    })

    // 创建一个图片对象
    const image = new Rect({
        fill: {
          type: 'image',
          url: '/public/example/001.png',
          mode: 'stretch',
        },
    })

    image.once(ImageEvent.LOADED, (e: ImageEvent)=>{
      // console.log('图片加载完成', image.width, image.height)

      // 创建一个画笔对象
      // const pen = new Pen()

      // // 创建一个橡皮擦
      // const eraser = new Pen({
      //   eraser: true,
      // })


      // // 按下鼠标拖动开始画线，抬起结束，当缩放平移视图后，仍然可以准确绘制新的线条
      // leafer.on(DragEvent.START, (e: DragEvent) => {
      //     const point = e.getPagePoint() // 转换事件为 page 坐标 = pen.getPagePoint(e)  //
      //     pen.setStyle({ stroke: '#32cd79', strokeWidth: 10, strokeCap: 'round', strokeJoin: 'round' })
      //     pen.moveTo(point.x, point.y)
      // })
      // leafer.on(DragEvent.DRAG, (e: DragEvent) => {
      //     const point = e.getPagePoint() // 转换事件为 page 坐标 = pen.getPagePoint(e)  //
      //     pen.lineTo(point.x, point.y)
      // })

      const mask = new Frame({
        width: image.width,
        height: image.height,
        fill: 'transparent',
        // mask: true
      })

    
      // mask.add(pen)
      leafer.add(mask)
      // image.mask = mask;
      leafer.zoom('fit')

      leaferRef.current = leafer;
      maskRef.current = mask;

    })

    leafer.add(image)

    // 自动居中
    return ()=>{ leafer.destroy() }
  }, [])

  const startDrawing = useCallback((e: DragEvent)=>{
    const point = e.getPagePoint() // 转换事件为 page 坐标 = pen.getPagePoint(e)  //
    // const pen = penRef.current;
    // if( !pen ) return;
    const pen = new Pen()
    cursorRef.current = pen;
    maskRef.current?.add(pen)
    // 根据当前模式，设置画笔样式
    pen.setStyle({ stroke: '000000', strokeWidth: 10, strokeCap: 'round', strokeJoin: 'round', blendMode: 'source-over' })
    pen.moveTo(point.x, point.y)
    // panRef.current = pen;
  }, [])

  const stopDrawing = useCallback((e: DragEvent)=>{
    const pen = cursorRef.current;
    if( !pen ) return;
    const point = e.getPagePoint() // 转换事件为 page 坐标 = pen.getPagePoint(e)  //
    pen.lineTo(point.x, point.y)
  }, [])

  const startErasing = useCallback((e: DragEvent)=>{
    const point = e.getPagePoint() // 转换事件为 page 坐标 = pen.getPagePoint(e)  //
    // const eraser = eraserRef.current;
    const eraser = new Pen()
    cursorRef.current = eraser;
    maskRef.current?.add(eraser)
    // 根据当前模式，设置画笔样式
    eraser.setStyle({ stroke: '#000000', strokeWidth: 10, strokeCap: 'round', strokeJoin: 'round', blendMode: 'destination-out' })
    eraser.moveTo(point.x, point.y)
  }, [])

  const stopErasing = useCallback((e: DragEvent)=>{
    const eraser = cursorRef.current;
    if( !eraser ) return;
    const point = e.getPagePoint() // 转换事件为 page 坐标 = pen.getPagePoint(e)  //
    eraser.lineTo(point.x, point.y)
  }, [])


  useEffect(()=>{
    if(!leaferRef.current ) return;
    const leafer = leaferRef.current;
    const offDrawing = ()=>{
      leafer.off(DragEvent.START, startDrawing)
      leafer.off(DragEvent.DRAG, stopDrawing)
    }

    const offErasing = ()=>{
      leafer.off(DragEvent.START, startErasing)
      leafer.off(DragEvent.DRAG, stopErasing)
    }

    if( mode === 'None' ){
      offDrawing();
      offErasing();
      return;
    };

    if(  mode === 'Eraser' ){
      offDrawing();
      leafer.on(DragEvent.START, startErasing)
      leafer.on(DragEvent.DRAG, stopErasing)
      return offErasing;
    }
    if( mode === 'Brush' ){
      offErasing();
      leafer.on(DragEvent.START, startDrawing)
      leafer.on(DragEvent.DRAG, stopDrawing)
      return offDrawing;
    }
 
  }, [mode, startDrawing, stopDrawing, startErasing, stopErasing])

  const handleExportMask = ()=>{
    maskRef.current?.export('mask.png')
  }

  return (
    <div className='editor-container'>
       <div>
        <Segmented
          value={mode}
          options={['Brush', 'Eraser', 'None']}
          onChange={(value) => {
            setMode(value as 'Brush' | 'Eraser' | 'None');
          }}
        />
      </div>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }}></canvas>
     
      <div>
        <button onClick={handleExportMask}>导出图片</button>
      </div>
    </div>
  )
}