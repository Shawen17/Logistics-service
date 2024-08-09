import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Input,
  Button,
  FormDisplay,
  Title,
  IconMail,
  SearchContainer,
  PasswordIcon,
} from '../LoginForm/LoginForm.style';
import { signup } from '../../pages/ApiHelper';
import { DATA_STATES } from '../../pages/HomePage/HomePage';
import { useHistory, Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

export interface SignupFormProps {
  initialValues?: {
    CustomerFirstName?: string;
    CustomerLastName?: string;
    CustomerEmail?: string;
    CustomerPassword?: string;
    ConfirmPassword?: string;
    CustomerNumber?: string;
  };
}

const SignupForm: React.FC<SignupFormProps> = ({ initialValues = {} }) => {
  const [inputValues, setValues] =
    useState<{
      CustomerFirstName?: string;
      CustomerLastName?: string;
      CustomerEmail?: string;
      CustomerNumber?: string;
      CustomerPassword?: string;
      ConfirmPassword?: string;
    }>(initialValues);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [loadingState, setLoadingState] = useState(DATA_STATES.loaded);
  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
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

    const {
      CustomerFirstName,
      CustomerLastName,
      CustomerNumber,
      CustomerEmail,
      CustomerPassword,
      ConfirmPassword,
    } = inputValues;
    if (
      CustomerEmail &&
      CustomerPassword &&
      CustomerFirstName &&
      CustomerLastName &&
      CustomerNumber &&
      ConfirmPassword
    ) {
      if (CustomerPassword === ConfirmPassword) {
        const { signupMessage, errorOccured } = await signup(
          CustomerFirstName,
          CustomerLastName,
          CustomerEmail,
          CustomerNumber,
          CustomerPassword
        );
        if (errorOccured) {
          setError(true);
        }
        setLoadingState(errorOccured ? DATA_STATES.error : DATA_STATES.loaded);
        if (!errorOccured && signupMessage) {
          history.push('/login');
        }
      } else {
        setError(true);
        setLoadingState(DATA_STATES.error);
      }
    }
  };

  useEffect(() => {
    const validatePassword = (pwd: string) => {
      const pattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/;

      if (inputValues.ConfirmPassword) {
        return pwd === inputValues.CustomerPassword;
      } else {
        return pattern.test(pwd);
      }
    };
    if (inputValues.ConfirmPassword) {
      setIsMatch(validatePassword(inputValues.ConfirmPassword));
    } else {
      if (inputValues.CustomerPassword) {
        setIsValid(validatePassword(inputValues.CustomerPassword));
      }
    }
  }, [inputValues.ConfirmPassword, inputValues.CustomerPassword]);

  let content;
  if (loadingState === DATA_STATES.loaded || DATA_STATES.error)
    content = (
      <FormDisplay onSubmit={HandleSubmit}>
        <Title className="font-montserrat-uniquifier p-1 mt-1 text-teal-500">
          Welcome! Register to get Started!
        </Title>
        {error && <p className="test-id-failure">Signup Unsuccesful</p>}
        <SearchContainer>
          <Input
            placeholder="First Name"
            type="text"
            name="CustomerFirstName"
            value={inputValues.CustomerFirstName || ''}
            onChange={HandleChange}
          />
        </SearchContainer>
        <SearchContainer>
          <Input
            placeholder="Last Name"
            type="text"
            name="CustomerLastName"
            value={inputValues.CustomerLastName || ''}
            onChange={HandleChange}
          />
        </SearchContainer>

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
            placeholder="Phone Number"
            type="text"
            name="CustomerNumber"
            value={inputValues.CustomerNumber || ''}
            onChange={HandleChange}
          />
        </SearchContainer>
        <SearchContainer>
          <Input
            placeholder="Password"
            title="password must contain at least one lower, upper, number, special character"
            type="password"
            name="CustomerPassword"
            value={inputValues.CustomerPassword || ''}
            onFocus={HandleFocus(setPasswordFocus)}
            onBlur={HandleBlur(setPasswordFocus)}
            onChange={HandleChange}
            isinvalid={!isValid}
          />
          {passwordFocus ? '' : <PasswordIcon />}
        </SearchContainer>
        {inputValues.ConfirmPassword &&
        inputValues.ConfirmPassword.length >=
          (inputValues.CustomerPassword?.length || 0) &&
        inputValues.CustomerPassword !== inputValues.ConfirmPassword ? (
          <p>Password does not match</p>
        ) : (
          ''
        )}
        <SearchContainer>
          <Input
            placeholder="Confirm Password"
            type="password"
            name="ConfirmPassword"
            value={inputValues.ConfirmPassword || ''}
            onChange={HandleChange}
            isinvalid={!isMatch}
          />
        </SearchContainer>

        <Link
          to="/login"
          className="font-montserrat-uniquifier text-2x1 p-1 mt-1 text-teal-500"
        >
          login
        </Link>
        <Button type="submit">Register</Button>
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

export default SignupForm;
