import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  RESET_DONE,
} from './types';
import axios from 'axios';
import { Dispatch } from 'redux';

const LOGIN_URL = '/api/users/login';
const SIGNUP_URL = '/api/users/register';

export const reset = () => async (dispatch:Dispatch) => {
  dispatch({
    type: RESET_DONE,
  });
};

export const login = (CustomerEmail:string , CustomerPassword:string) => async (dispatch:Dispatch) => {
  let loginData;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let errorOccured = false;
  const body = JSON.stringify({ CustomerEmail, CustomerPassword });

  try {
    const response = await axios.post(LOGIN_URL, body, config);

    if (response?.status === 200) {
      loginData = response.data.data;
      dispatch({
        type: LOGIN_SUCCESS,
        payload: loginData,
      });
    } else {
      dispatch({
        type: LOGIN_FAIL,
      });
      const message = response.data.message;
      throw message;
    }
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
    console.error(err);
    errorOccured = true;
  }
  return { loginData, errorOccured };
};

export const signup =
  (
    CustomerEmail:string,
    CustomerPassword:string,
    CustomerFirstName:string,
    CustomerLastName:string,
    CustomerNumber:string
  ) =>
  async (dispatch:Dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let errorOccured = false;
    let signupMessage: string | undefined;
    const body = JSON.stringify({
      CustomerFirstName,
      CustomerLastName,
      CustomerEmail,
      CustomerPassword,
      CustomerNumber,
    });
    

    try {
      const response = await axios.post(SIGNUP_URL, body, config);
      
      if (response?.status === 201) {
        signupMessage = response.data.message;
        
        dispatch({
          type: SIGNUP_SUCCESS,
          payload: signupMessage,
        });
      } else {
        signupMessage = response.data.message;
        
        throw signupMessage;
      }
    } catch (err) {
      if (err instanceof Error) {
        if(err.message === "Request failed with status code 409"){
          signupMessage= "User is Already Registered"
        }
        console.log(err.message);
      } else {
        console.log('An unknown error occurred');
      }
      dispatch({
        type: SIGNUP_FAIL,
      });
      
      errorOccured = true;
    }
    
    return { signupMessage, errorOccured };
  };

export const logout = () => (dispatch:Dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
