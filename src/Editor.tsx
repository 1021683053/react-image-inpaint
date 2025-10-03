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
  // const [ count, setCount ] = useState(0)
  const [ mode, setMode ] = useState<'Pen' | 'Eraser' | 'None'>('Pen')

  useEffect(()=>{
    setTimeout(() => {
      setMode('Eraser')
    }, 10000);
  },[])

  return (
    <div style={style} className={cx('react-image-inpaint', className)}>
      <Container canvasStyle={canvasStyle} canvasClassName={canvasClassName}>
        <Image />
        <Mask mode={mode} />
      </Container>
    </div>
  )
}