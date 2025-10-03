import { type PropsWithChildren, useRef, useEffect } from "react";
import { Leafer } from "leafer-ui";
import '@leafer-in/viewport';
import '@leafer-in/view';
import '@leafer-in/export';

import { useStore } from "./Context";
export type ContainerProps = {
  canvasStyle?: React.CSSProperties
  canvasClassName?: string
  count?: number
}



export const Container = (props: PropsWithChildren<ContainerProps>)=>{
  const { children, canvasClassName, canvasStyle, count } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setLeafer = useStore((store)=> store.setLeafer);
  const destroyLeafer = useStore((store)=> store.destroyLeafer);
  const leafer = useStore((store)=> store.leafer);

  useEffect(()=>{
    if( !canvasRef.current ) return
    const leafer = new Leafer({
      view: canvasRef.current, // view 参数支持设置 window 对象
      type: 'design',
      fill: '#333',
      wheel: {
        zoomMode: 'mouse'
      }
    })
    setLeafer(leafer);

    return destroyLeafer
  }, [setLeafer, destroyLeafer])

  useEffect(()=>{
    
  }, [leafer, count])

  return (
    <>
      {children}
      <canvas ref={canvasRef} style={{ ...canvasStyle, border: '1px solid #ccc' }} className={canvasClassName}></canvas>
    </>
  )

}