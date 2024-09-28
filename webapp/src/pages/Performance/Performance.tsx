import ActivityTable from '../../components/ActivityTable/ActivityTable';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { getAllActivities } from '../ApiHelper';
import { Activity } from '../../components/interfaces';
import { DATA_STATES } from '../KanbanBoard/KanbanBoard';
import { connect } from 'react-redux';
import { logout } from '../../action/auth';
import Spinner from '../../components/Spinner/Spinner';
import PageWrapper from '../PageWrapper';
import ActivityFilter from '../../components/ActivityTable/ActivityFilter';
import { User } from '../../components/interfaces';
import StaffDetails from '../../components/StaffDetails/StaffDetails';
import { RootState } from '../../components/interfaces';

export type searchValue = {
  order?: number;
  staff?: number;
  checked_by?: number;
  start_date?: string;
  end_date?: string;
};

const headerTitles = [
  'OrderID',
  'StaffID',
  'StartTime',
  'EndTime',
  'Duration',
  'CheckedBy',
  'QAStart',
  'QAEnd',
  'QADuration',
];

const Performance: React.FC<{ logout: any } & { role: string }> = ({
  logout,
  role,
}) => {
  const [data, setData] = useState<Activity[]>([]);
  const [loadingState, setLoadingState] = useState(DATA_STATES.waiting);
  const [input, setInputs] = useState<searchValue>({});
  const [staffInfo, setStaffInfo] = useState<User | {}>({});
  const [clicked, setClicked] = useState(false);
  const titles = role === 'manager' ? headerTitles : headerTitles.slice(0, -3);
  console.log(titles);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setClicked(!clicked);
  };

  useEffect(() => {
    const getActivity = async () => {
      setLoadingState(DATA_STATES.waiting);
      const { activityData, errorOccured, expired } =
        await getAllActivities(input);
      setData(activityData.activity);

      setStaffInfo({ ...activityData.staff, count: activityData.count });
      setLoadingState(errorOccured ? DATA_STATES.error : DATA_STATES.loaded);
      if (expired) {
        logout();
      }
    };
    getActivity();
  }, [clicked]);
  let content;
  if (loadingState === DATA_STATES.waiting) content = <Spinner />;
  else if (loadingState === DATA_STATES.loaded)
    content = (
      <>
        {input.staff && <StaffDetails details={staffInfo} />}
        <ActivityFilter
          handleChange={handleChange}
          input={input}
          handleSubmit={handleSubmit}
        />
        <ActivityTable titles={titles} activities={data} />
      </>
    );
  else content = <div>An error occured fetching the data!</div>;

  return (
    <PageWrapper>
      <h2 className="roboto-thin mb-10">Staff Activities</h2>
      {content}
    </PageWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  role: state.auth.role,
});

export default connect(mapStateToProps, { logout })(Performance);
