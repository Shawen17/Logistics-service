import {
  DetailsContainer,
  Title,
  Info,
  DetailItem,
  ProfilePic,
} from './StaffDetails.styles';

const StaffDetails = ({ details }) => {
  return (
    <DetailsContainer>
      <ProfilePic src="/static/default_profile_pic.png" alt="avatar" />
      <Title style={{ fontStyle: 'normal' }}>
        <b>{`${details.CustomerFirstName} ${details.CustomerLastName}`}</b>
      </Title>
      <div className="flex flex-row items-center justify-space-between p-4 h-full w-full">
        <DetailItem>
          <Title>Email</Title>
          <Info>{details.CustomerEmail}</Info>
        </DetailItem>
        <DetailItem>
          <Title>Phone Number</Title>
          <Info>{details.CustomerNumber}</Info>
        </DetailItem>
        <DetailItem>
          <Title>Role</Title>
          <Info>{details.Role}</Info>
        </DetailItem>
        <DetailItem>
          <Title>Order Processed</Title>
          <Info>{details.count}</Info>
        </DetailItem>
      </div>
    </DetailsContainer>
  );
};

export default StaffDetails;
