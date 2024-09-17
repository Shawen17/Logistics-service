import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
  width: 100%;
  padding: 5px;
  margin: 10px;
  background-color: whitesmoke;
  font-family: 'Fira Sans', sans-serif;
  font-weight: 400;
  font-style: normal;
`;

export const ProductList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ProductDetails = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const H = styled.h3`
  font-family: 'Fira Sans', sans-serif;
  font-weight: 400;
  font-style: italics;
`;
