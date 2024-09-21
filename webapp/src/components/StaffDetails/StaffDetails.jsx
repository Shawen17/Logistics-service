import {
  DetailsContainer,
  Title,
  Info,
  DetailItem,
} from './StaffDetails.styles';

const StaffDetails = ({ details }) => {
  return (
    <DetailsContainer>
      <DetailItem>
        <Title>Firstname</Title>
        <Info>{details.CustomerFirstName}</Info>
      </DetailItem>
      <DetailItem>
        <Title>Lastname</Title>
        <Info>{details.CustomerLastName}</Info>
      </DetailItem>
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
    </DetailsContainer>
  );
};

export default StaffDetails;
