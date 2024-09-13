import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquareXmark,
  faSquareCheck,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { Container } from './MovableItem.styles';

const MovableItem = ({ order, removeOrder, moveForward, moveBackward }) => {
  return (
    <Container>
      <button
        onClick={() => moveBackward(order)}
        disabled={order.OrderStatus === 'Queued'}
      >
        <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'lightgreen' }} />
      </button>
      <button
        onClick={() => moveForward(order)}
        disabled={order.OrderStatus === 'QA'}
      >
        <FontAwesomeIcon icon={faArrowRight} style={{ color: 'lightgreen' }} />
      </button>
      <span>{order.OrderID}</span>
      <span>{order.CustomerID}</span>
      {(() => {
        return (
          <button onClick={() => removeOrder(order)}>
            <FontAwesomeIcon
              icon={order.OrderStatus === 'QA' ? faSquareCheck : faSquareXmark}
              className={`${order.OrderStatus === 'QA' ? 'text-green-600' : 'text-red-600'} fa-lg`}
              data-testid={`draggable-btn-${order.OrderID}`}
            />
          </button>
        );
      })()}
    </Container>
  );
};

export default MovableItem;
