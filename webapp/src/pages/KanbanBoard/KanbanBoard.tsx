import React, { useState, useEffect } from 'react';
import MovableItemList from '../../components/MovableItemList/MovableItemList';
import { updateOrderStatus, getInPipelineData } from '../ApiHelper';
import Spinner from '../../components/Spinner/Spinner';
import PageWrapper from '../PageWrapper';
import { Container } from './KanbanBoard.styles';
import { Order, OrderData } from '../../components/interfaces';
import { connect } from 'react-redux';
import { RootState, User } from '../../components/interfaces';
import { logout } from '../../action/auth';

export const DATA_STATES = {
  waiting: 'WAITING',
  loaded: 'LOADED',
  error: 'ERROR',
};

interface PickerDashBoardProps {
  user: User | null;
}

const KanbanBoard: React.FC<PickerDashBoardProps & { logout: any }> = ({
  user,
  logout,
}) => {
  const [updated, setUpdated] = useState(false);
  const [loadingState, setLoadingState] = useState(DATA_STATES.waiting);
  const [data, setData] = useState({
    Queued: [],
    InProgress: [],
    QA: [],
  } as OrderData);
  const picker = user ? user.CustomerEmail : '';

  const getOrders = async () => {
    setLoadingState(DATA_STATES.waiting);
    const { orderData, errorOccured, expired } = await getInPipelineData();
    setData(orderData);
    setLoadingState(errorOccured ? DATA_STATES.error : DATA_STATES.loaded);
    if (expired) {
      logout();
    }
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
      const columnKey = order.OrderStatus as keyof OrderData;
      setData({
        ...data,
        [columnKey]: data[columnKey].filter(
          (otherOrder) => otherOrder.OrderID !== order.OrderID
        ),
      });
      setLoadingState(DATA_STATES.loaded);
      return true;
    }

    setLoadingState(DATA_STATES.loaded);
    logout();
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
          ID="0"
          listTitle="Queued"
          total={data.Queued.length}
          removeOrder={(order: Order) => confirmOrder(order)}
          moveForward={moveForward}
          moveBackward={moveBackward}
          items={data.Queued}
        />
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
      <h1 className="roboto-thin mb-10">ORDERS</h1>
      {content}
    </PageWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(KanbanBoard);
