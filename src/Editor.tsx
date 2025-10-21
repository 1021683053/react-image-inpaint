import React, { useEffect, useState } from 'react';
import cx from 'clsx';
import { Container } from './Container';
import { Image } from './Image';
import { Mask } from './Mask';

export type Editor = {
  style?: React.CSSProperties
  className?: string
  canvasStyle?: React.CSSProperties
  canvasClassName?: string
  imageUrl?: string
}

export const Editor = (props: Editor) => {
  const { style, className, canvasStyle, canvasClassName } = props;
  const [ mode, setMode ] = useState<'Pen' | 'Eraser' | 'None'>('Pen')
  const [ strokeWidth, setStrokeWidth] = useState<number>(60)
  return (
    <div style={style} className={cx('react-image-inpaint', className)}>
      <Container canvasStyle={canvasStyle} canvasClassName={canvasClassName}>
        <Image />
        <Mask mode={mode} strokeWidth={strokeWidth} />
      </Container>
      <div>
        <button onClick={()=> setMode('Pen') } style={{ backgroundColor: mode === 'Pen' ? 'lightblue' : undefined }}>Pen</button>
        <button onClick={()=> setMode('Eraser') } style={{ backgroundColor: mode === 'Eraser' ? 'lightblue' : undefined }}>Eraser</button>
        <button onClick={()=> setMode('None') } style={{ backgroundColor: mode === 'None' ? 'lightblue' : undefined }}>None</button>
        <br />
        <input type="range" min={2} max={300} defaultValue={strokeWidth} value={strokeWidth} step={2} onChange={e => setStrokeWidth(Number(e.target.value))} />
        <span> Brush Size: {strokeWidth} </span>
      </div>
    </div>
  )
}