import { DragEvent, Frame, Pen, Ellipse } from 'leafer-ui'
import { useStore } from './Context';
import { useEffect, useRef, useCallback } from 'react';

export type MaskProps = {
  mode: 'Pen' | 'Eraser' | 'None'
  strokeWidth?: number
}

export const Mask = (props: MaskProps) => {
  const { mode = "None", strokeWidth = 60 } = props
  const destroyMask = useStore((store)=> store.destroyMask);
  const leafer = useStore((store)=> store.leafer);
  const image = useStore((store)=> store.image);
  const setMask = useStore((store)=> store.setMask);
  const mask = useStore((store)=> store.mask);
  const metadata = useStore((store)=> store.metadata);

  const cursorRef = useRef<Pen | null >(null);

  const startDrawing = useCallback((e: DragEvent)=>{
    if( !mask ) return;
    const point = e.getPagePoint() // 转换事件为 page 坐标 = pen.getPagePoint(e)  //
    const pen = cursorRef.current = new Pen()
    mask?.add(pen)
    if( !pen ) return;
    mask.add(pen)
    // 根据当前模式，设置画笔样式
    pen.setStyle({ stroke: '000000', strokeWidth, strokeCap: 'round', strokeJoin: 'round', blendMode: 'source-over' })
    pen.moveTo(point.x, point.y)
    console.log('startDrawing', mask.width, mask.height)
  }, [ mask, strokeWidth ])

  const stopDrawing = useCallback((e: DragEvent)=>{
    const pen = cursorRef.current;
    if( !pen ) return;
    const point = e.getPagePoint() // 转换事件为 page 坐标 = pen.getPagePoint(e)  //
    pen.lineTo(point.x, point.y)
  }, [])

  const startErasing = useCallback((e: DragEvent)=>{
    if( !mask ) return;
    const point = e.getPagePoint() // 转换事件为 page 坐标 = pen.getPagePoint(e)  //
    const eraser = new Pen()
    cursorRef.current = eraser;
    mask.add(eraser)
    // 根据当前模式，设置画笔样式
    eraser.setStyle({ stroke: '#000000', strokeWidth, strokeCap: 'round', strokeJoin: 'round', blendMode: 'destination-out' })
    eraser.moveTo(point.x, point.y)
    console.log('startErasing', mask.width, mask.height)
  }, [mask, strokeWidth])

  const stopErasing = useCallback((e: DragEvent)=>{
    const eraser = cursorRef.current;
    if( !eraser ) return;
    const point = e.getPagePoint() // 转换事件为 page 坐标 = pen.getPagePoint(e)  //
    eraser.lineTo(point.x, point.y)
  }, [])


  // 画笔事件监听
  useEffect(()=>{
    if( !mode || !leafer ) return;
    if( mode === 'Pen' ){
      leafer.on(DragEvent.START, startDrawing)
      leafer.on(DragEvent.DRAG, stopDrawing)
    }
    if( mode === 'Eraser' ){
      leafer.on(DragEvent.START, startErasing)
      leafer.on(DragEvent.DRAG, stopErasing)
    }
    return ()=>{
      leafer.off(DragEvent.START)
      leafer.off(DragEvent.DRAG)
    }
  }, [ leafer, mode, startDrawing, stopDrawing, startErasing, stopErasing])

  // 初始化光标
  useEffect(()=>{
    if( !leafer || !mask ) return;
    // 创建一个笔刷元素
    const cursor = new Ellipse({
      x: 0,
      y: 0,
      width: strokeWidth,
      height: strokeWidth,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 2,
      isSelectable: false, // 禁止选中
      isHoverable: false   // 禁止 hover
    })
    leafer.add(cursor, 99999)
    leafer.on(DragEvent.MOVE, (e: DragEvent)=>{
      cursor.x = e.getPagePoint().x - (strokeWidth/2)
      cursor.y = e.getPagePoint().y - (strokeWidth/2)
    })
    return ()=>{
      cursor.destroy()
    }
  }, [leafer, mask, strokeWidth])


  // 初始化遮罩
  useEffect(()=>{
    if( !leafer || !image ) return;
    const mask = new Frame({
      width: metadata.maskWidth,
      height: metadata.maskHeight,
      fill: 'transparent',
      blendMode: 'source-over',
      cursor: 'none',
    })
    leafer.add(mask);
    setMask(mask);
    return destroyMask
  }, [leafer, image, destroyMask, setMask, metadata])

  return null;
}