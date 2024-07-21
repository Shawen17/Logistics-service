import React, { useState } from "react";
import { ProductProps } from "../interfaces";
import { Circle, ProductContainer, Details, LikeIcon } from "./Product.style";
import ProductImg from "./ProductImg";
import { pink } from "@mui/material/colors";

interface ProductDetailsModalProps {
  product: ProductProps;
}

const Product: React.FC<ProductDetailsModalProps> = ({ product }) => {
  const [liked, setLiked] = useState(false);

  const HandleLiked = () => {
    setLiked((prev) => !prev);
  };
  const color = { color: pink[500] };

  return (
    <ProductContainer>
      <LikeIcon
        data-testid="like-icon"
        onClick={HandleLiked}
        sx={liked ? color : {}}
      />
      <Circle>
        <ProductImg
          src={product.ProductPhotoURL}
          alt="product"
          effect={undefined}
        />
      </Circle>

      <div className="text-2xs font-montserrat-uniquifier font-black">
        <Details>
          <div className="ml">{product.ProductName}</div>
          <div>Id: {product.ProductID}</div>
        </Details>
        <div className="flex justify-center items-center">
          <button className="bg-teal-500 text-white rounded text-2x1 p-1 mt-1 hover:bg-teal-600 hover:shadow-lg transition duration-300">
            Pick
          </button>
        </div>
      </div>
    </ProductContainer>
  );
};

export default Product;
