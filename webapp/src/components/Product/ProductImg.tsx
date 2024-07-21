import React from "react";
import styled from "styled-components";
import {
  LazyLoadImage,
  LazyLoadImageProps,
  Effect,
} from "react-lazy-load-image-component";

interface ProductImgProps extends LazyLoadImageProps {
  effect?: Effect;
  alt: string;
  src: string;
}

const StyledLazyLoadImage = styled(LazyLoadImage)`
  padding: 8px;
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImg: React.FC<ProductImgProps> = ({ src, alt, effect }) => {
  return <StyledLazyLoadImage src={src} alt={alt} effect={effect} />;
};

export default ProductImg;
