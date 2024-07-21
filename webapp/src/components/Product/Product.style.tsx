import styled from "styled-components";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";

export const Circle = styled.div`
  background-color: rgba(128, 128, 128, 0.2);
  height: 70%;
  width: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LikeIcon = styled(FavoriteTwoToneIcon)`
  position: absolute;
  margin: 5px;
  top: 0;
  right: 0;
`;

export const ProductContainer = styled.div`
  height: 280px;
  width: 180px;
  padding: 7px;
  position: relative;
  border-radius: 6px;
  cursor: pointer;
  margin: 15px;
  background-color: whitesmoke;

  &:hover {
    transform: scale(1.1);
    transition: 1s ease-in-out;
  }
`;

export const Details = styled.div`
  padding: 3px;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const Circ = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 0.5px solid grey;
`;
