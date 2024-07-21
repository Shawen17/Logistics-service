declare module 'react-lazy-load-image-component' {
    import * as React from 'react';
  
    export interface LazyLoadImageProps {
      alt?: string;
      height?: string | number;
      src: string;
      width?: string | number;
      effect?: 'opacity' | 'blur' | 'black-and-white' | 'grayscale';
      placeholderSrc?: string;
      visibleByDefault?: boolean;
      afterLoad?: () => void;
      beforeLoad?: () => void;
      delayMethod?: 'debounce' | 'throttle';
      delayTime?: number;
      scrollPosition?: { x: number; y: number };
      threshold?: number;
      useIntersectionObserver?: boolean;
      wrapperClassName?: string;
      onError?: (error: any) => void;
      style?: React.CSSProperties;
    }
  
    export class LazyLoadImage extends React.Component<LazyLoadImageProps> {}
  
    export type Effect = 'opacity' | 'blur' | 'black-and-white' | 'grayscale' 
  }
  