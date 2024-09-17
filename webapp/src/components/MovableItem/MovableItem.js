import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquareXmark,
  faSquareCheck,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { Container } from './MovableItem.styles';
import { connect } from 'react-redux';

const MovableItem = ({
  order,
  removeOrder,
  moveForward,
  moveBackward,
  role,
}) => {
  return (
    <Container>
      <button
        onClick={() => moveBackward(order)}
        disabled={
          order.OrderStatus === 'Queued' ||
          (order.OrderStatus === 'QA' &&
            role !== 'team_lead' &&
            role !== 'manager')
        }
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={{
            color: order.OrderStatus === 'Queued' ? 'grey' : 'lightgreen',
          }}
        />
      </button>
      <button
        onClick={() => moveForward(order)}
        disabled={order.OrderStatus === 'QA'}
      >
        <FontAwesomeIcon
          icon={faArrowRight}
          style={{ color: order.OrderStatus === 'QA' ? 'grey' : 'lightgreen' }}
        />
      </button>

      <span>ord_id: {order.OrderID}</span>
      <span>cust_id: {order.CustomerID}</span>
      {(() => {
        return (
          <button
            onClick={() => removeOrder(order)}
            disabled={role !== 'team_lead' && role !== 'manager'}
          >
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loginFailed: state.auth.failed,
  role: state.auth.role,
});

export default connect(mapStateToProps, null)(MovableItem);
