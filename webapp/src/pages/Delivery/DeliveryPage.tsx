import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { useReactToPrint } from 'react-to-print';
import { connect } from 'react-redux';
import { getInDeliveryData } from '../ApiHelper';
import Spinner from '../../components/Spinner/Spinner';
import PageWrapper from '../PageWrapper';
import { Container } from '../KanbanBoard/KanbanBoard.styles';
import { Order } from '../../components/interfaces';
import { RootState, User } from '../../components/interfaces';
import { logout } from '../../action/auth';
import OrderSheetPage from '../OrderSheetPage/OrderSheetPage';

export const DATA_STATES = {
  waiting: 'WAITING',
  loaded: 'LOADED',
  error: 'ERROR',
};

const PickerDashBoard: React.FC<{ logout: any }> = ({ logout }) => {
  const [loadingState, setLoadingState] = useState(DATA_STATES.waiting);
  const [data, setData] = useState<Order[]>([]);
  const [refresh, setRefresh] = useState(false);
  const componentRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getOrders = async () => {
    setLoadingState(DATA_STATES.waiting);
    const { data, errorOccured, expired } = await getInDeliveryData();
    setData(data);
    setLoadingState(errorOccured ? DATA_STATES.error : DATA_STATES.loaded);
    if (expired) {
      logout();
    }
  };

  useEffect(() => {
    getOrders();
  }, [refresh]);

  let content;
  if (loadingState === DATA_STATES.waiting)
    content = (
      <Container data-testid="loading-spinner-container">
        <Spinner />
      </Container>
    );
  else if (loadingState === DATA_STATES.loaded)
    content = <Container data-testid="pipeline-container"></Container>;
  else
    content = (
      <Container data-testid="error-container">
        An error occured fetching the data!
      </Container>
    );

  return (
    <PageWrapper>
      {content}
      <div
        className="flex flex-col items-center justify-center p-4 h-full w-full"
        ref={componentRef}
      >
        <h2 className="roboto-thin mb-5">Orders Awaiting Delivery</h2>

        {data.length > 0 ? (
          <>
            {data.map((item) => (
              <OrderSheetPage
                key={item.OrderID}
                item={item}
                delivery={true}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            ))}
          </>
        ) : (
          ''
        )}
      </div>
      <button onClick={handlePrint} className="print-button">
        Print
        <FontAwesomeIcon
          icon={faPrint}
          style={{
            color: 'grey',
            marginLeft: 4,
            fontSize: 15,
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
