import { useRef } from 'react';
import { App, Group, Leafer, Pen, DragEvent, Cursor, Rect, Ellipse, Frame, ImageEvent } from 'leafer-ui'

export const useImage = () => {
  const image = new Rect({
    fill: {
      type: 'image',
      url: '/public/example/001.png',
      mode: 'stretch',
    },
  })
  return image
}