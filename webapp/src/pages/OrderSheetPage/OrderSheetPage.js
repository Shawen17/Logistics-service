import {
  Container,
  ProductList,
  ProductDetails,
  Info,
  H,
} from './OrderSheetPage.styles';

const OrderSheetPage = ({ item }) => {
  return (
    <Container>
      <Info>
        <H>Order_id</H>
        <>{item.OrderID}</>
      </Info>

      <ProductList>
        <ProductDetails>
          <H>Product_ID(s)</H>
          {item.Products.product_ids.map((item, index) => {
            return <span key={item - index}>{item}</span>;
          })}
        </ProductDetails>
        <ProductDetails>
          <H>Quantity</H>
          {item.Products.quantities.map((item, index) => (
            <span key={item - index}>{item}</span>
          ))}
        </ProductDetails>
      </ProductList>
      <Info>
        <H>Order Date</H>
        <>{item.OrderDate}</>
      </Info>
      <Info>
        <H>Delivery</H>
        <>{item.Address}</>
      </Info>
    </Container>
  );
};

export default OrderSheetPage;
