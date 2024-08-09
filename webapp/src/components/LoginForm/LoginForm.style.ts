import styled, { css } from 'styled-components'
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';


interface InputProps {
  isinvalid?: boolean;
}


export const FormDisplay = styled.form`
  width: 40%;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
  padding: 20px;

  @media screen and (max-width: 568px) {
    padding: 10px;
    width: 80%;
    margin: 0px;
  }
`;



export const IconMail = styled(EmailIcon)`
width:20%;
display:flex;
align-items:center;
justify-content:flex-end;
padding:2px;
`

export const PasswordIcon = styled(LockIcon)`
width:20%;
display:flex;
align-items:center;
justify-content:flex-end;
padding:2px;
`
export const PasswordUnlockIcon = styled(LockOpenIcon)`
width:20%;
display:flex;
align-items:center;
justify-content:flex-end;
padding:2px;
`

export const Input = styled.input<InputProps>`
  width: 80%;
  height:100%;
  padding:20px;
  border: none;
  background-color: transparent;
  border-style: none;

::placeholder {
    font-size: 10px;
    font-style: italic;
  }
  &:focus {
    outline: none;
    border: 2px solid #00b894;
    box-shadow: 0 0 10px #00b894;
    border-radius:6px;
    width: 100%;
  }

  &:not(:focus) {
    background-color: transparent;
  }

  ${(props) =>
    props.isinvalid &&
    css`
      border: 2px solid red;
    `}


`;

export const SearchContainer = styled.div`
  width: 100%;
  border: none;
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-radius: 6px;
  background-color: rgba(128, 128, 128, 0.2);
  height:50px;
  border-style: none;
  margin-bottom:10px;



  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;


export const Label = styled.label`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-buttom: 3px;
  font-size: 13px;
`;

export const Title = styled.div`
  display: flex;
  font-size: 18px;
  font-family: "Urbanist", sans-serif;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-weight: bold;
`;

export const Button = styled.button`
  width: 100%;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #0eb3f4;
  margin: 20px 0px 5px 0px;
  cursor: pointer;
  &:hover {
    background-color: #126180;
  }
`;
