import OrderSheetPage from '../OrderSheetPage/OrderSheetPage';
import { useEffect, useState } from 'react';
import MovableItemList from '../../components/MovableItemList/MovableItemList';
import {
  updateOrderStatus,
  pickerInpipelineOrder,
  handlePrint,
} from '../ApiHelper';
import Spinner from '../../components/Spinner/Spinner';
import PageWrapper from '../PageWrapper';
import { Container } from '../KanbanBoard/KanbanBoard.styles';
import { Order, PickerOrder } from '../../components/interfaces';
import { connect } from 'react-redux';
import { RootState, User } from '../../components/interfaces';
import { logout } from '../../action/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

export const DATA_STATES = {
  waiting: 'WAITING',
  loaded: 'LOADED',
  error: 'ERROR',
};

interface PickerDashBoardProps {
  user: User | null;
}

const PickerDashBoard: React.FC<PickerDashBoardProps & { logout: any }> = ({
  user,
  logout,
}) => {
  const [updated, setUpdated] = useState(false);
  const [loadingState, setLoadingState] = useState(DATA_STATES.waiting);
  const [data, setData] = useState({
    InProgress: [],
    QA: [],
  } as PickerOrder);
  const picker = user ? user.CustomerEmail : '';
  let orderSheetData: Order[] = [...data.InProgress];

  const getOrders = async () => {
    setLoadingState(DATA_STATES.waiting);
    const { orderData, errorOccured } = await pickerInpipelineOrder(picker);
    setData(orderData);
    setLoadingState(errorOccured ? DATA_STATES.error : DATA_STATES.loaded);
  };

  const confirmOrder = async (order: Order): Promise<boolean> => {
    setLoadingState(DATA_STATES.waiting);
    const newOrderStatus =
      order.OrderStatus === 'QA' ? 'Complete' : 'Cancelled';

    const orderStatusUpdated = await updateOrderStatus(
      order,
      newOrderStatus,
      picker
    );
    if (orderStatusUpdated) {
      const columnKey = order.OrderStatus as keyof PickerOrder;
      setData({
        ...data,
        [columnKey]: data[columnKey].filter(
          (otherOrder) => otherOrder.OrderID !== order.OrderID
        ),
      });
      setLoadingState(DATA_STATES.loaded);
      logout();
      return true;
    }

    setLoadingState(DATA_STATES.loaded);
    return false;
  };

  useEffect(() => {
    getOrders();
  }, [updated]);

  const moveForward = async (input: Order): Promise<boolean> => {
    setLoadingState(DATA_STATES.waiting);
    let newOrderStatus;
    if (input.OrderStatus === 'Queued') {
      newOrderStatus = 'InProgress';
    } else if (input.OrderStatus === 'InProgress') {
      newOrderStatus = 'QA';
    }

    const orderStatusUpdated =
      newOrderStatus &&
      (await updateOrderStatus(input, newOrderStatus, picker));
    if (orderStatusUpdated) {
      setUpdated(!updated);
      setLoadingState(DATA_STATES.loaded);
      return true;
    }
    setLoadingState(DATA_STATES.loaded);
    logout();
    return false;
  };

  const moveBackward = async (input: Order): Promise<boolean> => {
    setLoadingState(DATA_STATES.waiting);
    let newOrderStatus;
    if (input.OrderStatus === 'QA') {
      newOrderStatus = 'InProgress';
    } else if (input.OrderStatus === 'InProgress') {
      newOrderStatus = 'Queued';
    }

    const orderStatusUpdated =
      newOrderStatus &&
      (await updateOrderStatus(input, newOrderStatus, picker));
    if (orderStatusUpdated) {
      setUpdated(!updated);
      setLoadingState(DATA_STATES.loaded);
      return true;
    }
    setLoadingState(DATA_STATES.loaded);
    logout();
    return false;
  };

  let content;
  if (loadingState === DATA_STATES.waiting)
    content = (
      <Container data-testid="loading-spinner-container">
        <Spinner />
      </Container>
    );
  else if (loadingState === DATA_STATES.loaded)
    content = (
      <Container data-testid="pipeline-container">
        <MovableItemList
          ID="1"
          listTitle="In Progess"
          total={data.InProgress.length}
          removeOrder={(order: Order) => confirmOrder(order)}
          moveForward={moveForward}
          moveBackward={moveBackward}
          items={data.InProgress}
        />
        <MovableItemList
          ID="2"
          listTitle="QA"
          total={data.QA.length}
          removeOrder={(order: Order) => confirmOrder(order)}
          moveForward={moveForward}
          moveBackward={moveBackward}
          items={data.QA}
        />
      </Container>
    );
  else
    content = (
      <Container data-testid="error-container">
        An error occured fetching the data!
      </Container>
    );

  return (
    <PageWrapper>
      <h1 className="roboto-thin mb-5">YOUR ORDERS</h1>
      {content}
      <h2 className="roboto-thin mb-5">ORDER SHEET</h2>

      {orderSheetData.length > 0 ? (
        <>
          {orderSheetData.map((item) => (
            <OrderSheetPage key={item.OrderID} item={item} />
          ))}
        </>
      ) : (
        ''
      )}
      <button onClick={handlePrint} className="print-button">
        <FontAwesomeIcon
          icon={faPrint}
          style={{
            color: 'lightgreen',
          }}
        />
      </button>
    </PageWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(PickerDashBoard);
