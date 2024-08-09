import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import SignupForm from './SignupForm';

export default {
  title: 'Components/SignupForm',
  component: SignupForm,
} as ComponentMeta<typeof SignupForm>;

const Template: ComponentStory<typeof SignupForm> = (args) => (
  <BrowserRouter>
    <SignupForm {...args} />
  </BrowserRouter>
);

export const Default = Template.bind({});
Default.args = {
  initialValues: {
    CustomerFirstName: '',
    CustomerLastName: '',
    CustomerEmail: '',
    CustomerPassword: '',
    ConfirmPassword: '',
    CustomerNumber: '',
  },
};

export const Prefilled = Template.bind({});
Prefilled.args = {
  initialValues: {
    CustomerFirstName: 'John',
    CustomerLastName: 'Doe',
    CustomerEmail: 'john.doe@example.com',
    CustomerPassword: 'Password123!',
    ConfirmPassword: 'Password123!',
    CustomerNumber: '1234567890',
  },
};
