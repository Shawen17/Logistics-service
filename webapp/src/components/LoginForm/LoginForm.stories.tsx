import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import LoginForm, { LoginFormProps } from "./LoginForm";
import { BrowserRouter } from "react-router-dom";

export default {
  title: "Components/LoginForm",
  component: LoginForm,
} as ComponentMeta<typeof LoginForm>;

const Template: ComponentStory<typeof LoginForm> = (args) => (
  <BrowserRouter>
    <LoginForm {...args} />
  </BrowserRouter>
);

export const Default = Template.bind({});
Default.args = {
  initialValues: {},
} as LoginFormProps;

export const WithPrefilledEmail = Template.bind({});
WithPrefilledEmail.args = {
  initialValues: {
    CustomerEmail: "test@example.com",
  },
} as LoginFormProps;

export const WithPrefilledEmailAndPassword = Template.bind({});
WithPrefilledEmailAndPassword.args = {
  initialValues: {
    CustomerEmail: "test@example.com",
    CustomerPassword: "password123",
  },
} as LoginFormProps;
