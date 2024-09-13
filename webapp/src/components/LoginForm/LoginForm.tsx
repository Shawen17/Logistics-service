import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Input,
  Button,
  FormDisplay,
  Title,
  IconMail,
  SearchContainer,
  PasswordIcon,
} from './LoginForm.style';
import { login } from '../../pages/ApiHelper';
import { DATA_STATES } from '../../pages/KanbanBoard/KanbanBoard';
import { useHistory, Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

export interface LoginFormProps {
  initialValues?: {
    CustomerEmail?: string;
    CustomerPassword?: string;
  };
}

const LoginForm: React.FC<LoginFormProps> = ({ initialValues = {} }) => {
  const [inputValues, setValues] = useState<{
    CustomerEmail?: string;
    CustomerPassword?: string;
  }>(initialValues);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [loadingState, setLoadingState] = useState(DATA_STATES.loaded);
  const [error, setError] = useState(false);
  const history = useHistory();

  const HandleFocus =
    (setFocus: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setFocus(true);
    };

  const HandleBlur =
    (setFocus: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setFocus(false);
    };

  const HandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const name = event.target.name;
    const value = event.target.value;
    setValues((values) => ({ ...values, [name]: value.trim() }));
  };

  const HandleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoadingState(DATA_STATES.waiting);
    const { CustomerEmail, CustomerPassword } = inputValues;
    if (CustomerEmail && CustomerPassword) {
      const { loginData, errorOccured } = await login(
        CustomerEmail,
        CustomerPassword
      );
      if (errorOccured) {
        setError(true);
      }
      setLoadingState(errorOccured ? DATA_STATES.error : DATA_STATES.loaded);
      if (!errorOccured && loginData) {
        localStorage.setItem('token', loginData.token);
        history.push('/products');
      }
    } else {
      setError(true);
      setLoadingState(DATA_STATES.error);
    }
  };

  let content;
  if (loadingState === DATA_STATES.loaded || DATA_STATES.error)
    content = (
      <FormDisplay onSubmit={HandleSubmit}>
        <Title className="font-montserrat-uniquifier p-1 mt-1 text-teal-500">
          Welcome! Enter Details
        </Title>
        {error && <p>Invalid Email or Password</p>}
        <SearchContainer>
          <Input
            placeholder="abc@yahoo.com"
            type="email"
            name="CustomerEmail"
            value={inputValues.CustomerEmail || ''}
            onChange={HandleChange}
            onFocus={HandleFocus(setEmailFocus)}
            onBlur={HandleBlur(setEmailFocus)}
          />
          {emailFocus ? '' : <IconMail />}
        </SearchContainer>
        <SearchContainer>
          <Input
            placeholder="your password"
            type="password"
            name="CustomerPassword"
            value={inputValues.CustomerPassword || ''}
            onFocus={HandleFocus(setPasswordFocus)}
            onBlur={HandleBlur(setPasswordFocus)}
            onChange={HandleChange}
          />
          {passwordFocus ? '' : <PasswordIcon />}
        </SearchContainer>
        <div className="font-montserrat-uniquifier text-2x1 p-1 mt-1 text-teal-500">
          forgot password?
          <Link className="ml-5" to="/signup">
            New User?
          </Link>
        </div>
        <Button type="submit">Login</Button>
      </FormDisplay>
    );
  else
    content = (
      <div data-testid="loading-spinner-container">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-row justify-center w-full pt-4">{content}</div>
  );
};

export default LoginForm;
