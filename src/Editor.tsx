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
        <button onClick={()=> setMode('Pen') }>Pen</button>
        <button onClick={()=> setMode('Eraser') }>Eraser</button>
        <button onClick={()=> setMode('None') }>None</button>

        <br />
        <button onClick={()=> setStrokeWidth(40)}>40</button>
        <button onClick={()=> setStrokeWidth(60)}>60</button>
        <button onClick={()=> setStrokeWidth(80)}>80</button>
        <button onClick={()=> setStrokeWidth(100)}>100</button>
        <button onClick={()=> setStrokeWidth(120)}>120</button>
        <button onClick={()=> setStrokeWidth(160)}>160</button>
      </div>
    </div>
  )
}