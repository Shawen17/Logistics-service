import PageWrapper from "../PageWrapper";
import Product from "../../components/Product/Product";
import { ProductItemProps } from "../../components/interfaces";
import { useState, useEffect } from "react";
import { DATA_STATES } from "../HomePage/HomePage";
import { getAllProducts } from "../ApiHelper";
import Spinner from "../../components/Spinner/Spinner";

const ProductsPage = () => {
  const [loadingState, setLoadingState] = useState(DATA_STATES.waiting);
  const [products, setProducts] = useState<ProductItemProps>({
    items: [
      {
        ProductID: 0,
        ProductName: "",
        ProductPhotoURL: "",
        ProductStatus: "Active",
      },
    ],
  });

  const getProducts = async () => {
    setLoadingState(DATA_STATES.waiting);
    const { productData, errorOccured } = await getAllProducts();
    setProducts({ items: productData });
    setLoadingState(errorOccured ? DATA_STATES.error : DATA_STATES.loaded);
  };

  useEffect(() => {
    getProducts();
  }, []);

  let content;
  if (loadingState === DATA_STATES.waiting)
    content = (
      <div
        className="flex flex-row justify-center w-full pt-4"
        data-testid="loading-spinner-container"
      >
        <Spinner />
      </div>
    );
  else if (loadingState === DATA_STATES.loaded)
    content = (
      <div className="flex flex-wrap flex-row justify-center w-full pt-8 mt-8 bg-white">
        {products.items.map((product) => {
          return <Product key={product.ProductID} product={product} />;
        })}
      </div>
    );
  else
    content = (
      <div
        className="flex flex-row justify-center w-full pt-4 text-3xl font-bold text-white"
        data-testid="error-container"
      >
        An error occured fetching the data!
      </div>
    );

  return <PageWrapper>{content}</PageWrapper>;
};

export default ProductsPage;
