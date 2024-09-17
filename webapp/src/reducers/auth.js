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
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAIL,
  RESET_DONE,
} from '../action/types';

const initialState = {
  access: localStorage.getItem('access'),
  isAuthenticated: false,
  user: null,
  failed: false,
  role: null,
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('access', payload.token);
      localStorage.setItem('email', payload.CustomerEmail);

      return {
        ...state,
        isAuthenticated: true,
        user: payload,
        access: payload.token,
        role: payload.Role,
      };

    case SIGNUP_SUCCESS:
      return {
        ...state,
      };

    case AUTHENTICATION_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        failed: false,
      };
    case AUTHENTICATION_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        failed: true,
      };

    case RESET_DONE:
      return {
        ...state,
        failed: false,
      };

    case LOGIN_FAIL:
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        failed: true,
      };
    case SIGNUP_FAIL:
    case LOGOUT:
      localStorage.removeItem('email');
      localStorage.removeItem('access');

      return {
        ...state,
        access: null,
        isAuthenticated: false,
        user: null,
        failed: false,
        role: null,
      };
    case PASSWORD_RESET_SUCCESS:
    case PASSWORD_RESET_FAIL:
    case PASSWORD_RESET_CONFIRM_SUCCESS:
    case PASSWORD_RESET_CONFIRM_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
}
