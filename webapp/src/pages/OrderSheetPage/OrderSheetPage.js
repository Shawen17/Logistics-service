import {
  Container,
  ProductList,
  ProductDetails,
  Info,
  H,
  DeliveryButton,
} from './OrderSheetPage.styles';
import { updateDeliveryStatus } from '../ApiHelper';

const OrderSheetPage = ({ item, delivery, setRefresh, refresh }) => {
  const DeliveryClicked = async (order_id) => {
    const status = await updateDeliveryStatus(order_id);
    if (status) {
      setRefresh(!refresh);
    }
  };

  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', options);
  };

  return (
    <Container>
      <Info>
        <H>Order_Ref</H>
        <>{item.ref}</>
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
        <>{formatDate(item.OrderDate)}</>
      </Info>
      <Info>
        <H>Delivery</H>
        <>{item.Address}</>
      </Info>
      <Info>
        {delivery && (
          <DeliveryButton onClick={() => DeliveryClicked(item.OrderID)}>
            mark as delivered
          </DeliveryButton>
        )}
      </Info>
    </Container>
  );
};

export default OrderSheetPage;
