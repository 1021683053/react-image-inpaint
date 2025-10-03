import { Rect, ImageEvent } from 'leafer-ui'
import { useStore } from './Context';
import { useEffect } from 'react';

export const Image = () => {
  const destroyImage = useStore((store)=> store.destroyImage);
  const leafer = useStore((store)=> store.leafer);
  const setImage = useStore((store)=> store.setImage);
  const setMetadata = useStore((store)=> store.setMetadata);
  // const image = useStore((store)=> store.image);

  // const onImageLoaded = useCallback((e: ImageEvent)=>{
  //   // if( !image ) return;
  //   // setImage(image)
  //   leafer?.zoom('fit')
  // }, [leafer, setImage])
  useEffect(()=>{
    if( !leafer ) return;
    const image = new Rect({
      fill: {
        type: 'image',
        url: '/public/example/001.png',
        mode: 'stretch',
      }
    })
    image.once(ImageEvent.LOADED, (e: ImageEvent)=>{
      setMetadata({ maskWidth: image.width!, maskHeight: image.height! })
      leafer?.zoom('fit')
    })
    leafer.add(image);
    setImage(image);
    return destroyImage
  }, [leafer, destroyImage, setImage, setMetadata])
  return null;
}