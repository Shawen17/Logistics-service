import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignupForm from './SignupForm';
import { signup } from '../../action/auth';

jest.mock('../../pages/ApiHelper', () => ({
  signup: jest.fn(),
}));

describe('SignupForm', () => {
  const initialValues = {
    CustomerFirstName: '',
    CustomerLastName: '',
    CustomerEmail: '',
    CustomerPassword: '',
    ConfirmPassword: '',
    CustomerNumber: '',
  };

  const setup = () => {
    return render(
      <Router>
        <SignupForm initialValues={initialValues} />
      </Router>
    );
  };

  it('renders the signup form correctly', () => {
    setup();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('abc@yahoo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    setup();
    const firstNameInput = screen.getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput).toHaveValue('John');
  });

  // it('displays an error if passwords do not match', () => {
  //   setup();
  //   const passwordInput = screen.getByPlaceholderText('Password');
  //   const confirmPasswordInput =
  //     screen.getByPlaceholderText('Confirm Password');

  //   fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
  //   fireEvent.change(confirmPasswordInput, {
  //     target: { value: 'Password1234!' },
  //   });

  //   expect(screen.getByText("Password doesn't match")).toBeInTheDocument();
  // });

  it('calls signup API on form submission with correct values', async () => {
    (signup as jest.Mock).mockResolvedValue({
      signupMessage: 'Success',
      errorOccured: false,
    });

    setup();
    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('abc@yahoo.com'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
        'Password123!'
      );
    });
  });

  // it('displays an error message on signup failure', async () => {
  //   (signup as jest.Mock).mockResolvedValue({
  //     signupMessage: '',
  //     errorOccured: true,
  //   });

  //   setup();
  //   fireEvent.change(screen.getByPlaceholderText('First Name'), {
  //     target: { value: 'John' },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText('Last Name'), {
  //     target: { value: 'Doe' },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText('abc@yahoo.com'), {
  //     target: { value: 'john.doe@example.com' },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
  //     target: { value: '1234567890' },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText('Password'), {
  //     target: { value: 'Password123!' },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
  //     target: { value: 'Password123!' },
  //   });

  //   fireEvent.click(screen.getByText(/register/i));

  //   await waitFor(() => {
  //     expect(screen.getByText('Signup Unsuccessful')).toBeInTheDocument();
  //   });
  // });
});
