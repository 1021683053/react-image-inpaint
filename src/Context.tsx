import { createContext, type PropsWithChildren, useRef, useContext } from "react";
import { create, useStore as useZustandStore, type ExtractState } from "zustand";
import { Frame, Leafer, Rect } from "leafer-ui";


export type Store = ReturnType<typeof createStore>;

export const Context = createContext<Store | null>(null);

export const Provider = (props: PropsWithChildren)=>{
  const { children } = props;
  const store = useRef(createStore()).current;

  return (
    <Context.Provider value={store}>
      {children}
    </Context.Provider>
  )
}

export function useStore(): ExtractState<Store>
export function useStore<U>(selector: (state: ExtractState<Store>) => U): U
export function useStore(selector?: any) {
  const store = useContext(Context);
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useZustandStore(store, selector)
}

export const createStore = ()=>{
  return create<{
    leafer: Leafer | null;
    setLeafer: (leafer: Leafer)=>void;
    destroyLeafer: ()=>void;
    image: Rect | null;
    setImage: (image: Rect)=>void;
    destroyImage: ()=>void;
    mask: Frame | null;
    setMask: (mask: Frame)=>void;
    destroyMask: ()=>void;
    metadata: { maskWidth: number; maskHeight: number };
    setMetadata: (metadata: { maskWidth: number; maskHeight: number })=>void;
  }>((set, get)=>({
    leafer: null,
    image: null,
    mask: null,
    metadata: { maskWidth: 100, maskHeight: 100 },
    setLeafer: (leafer: Leafer)=>{
      set({ leafer });
    },
    destroyLeafer: ()=>{
      get().leafer?.destroy()
      set({ leafer: null });
    },
    setImage: (image: Rect)=>{
      set({ image });
    },
    destroyImage: ()=>{
      get().image?.destroy()
      set({ image: null });
    },
    setMask: (mask: Frame)=>{
      set({ mask });
    },
    destroyMask: ()=>{
      get().mask?.destroy()
      set({ mask: null });
    },
    setMetadata: (metadata: { maskWidth: number; maskHeight: number })=>{
      set({ metadata });
    },
  }))
}
