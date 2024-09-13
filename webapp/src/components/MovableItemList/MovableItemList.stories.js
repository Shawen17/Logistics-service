import React from 'react';
import MovableItemList from './MovableItemList';

// Define metadata about the story
export default {
  title: 'Components/MovableItemList', // Storybook categorization
  component: MovableItemList, // The component being showcased
};

// Create a template for the component
const Template = (args) => <MovableItemList {...args} />;

// Sample data for items
const sampleItems = [
  { OrderID: 1, CustomerID: 27 },
  { OrderID: 2, CustomerID: 32 },
  { OrderID: 3, CustomerID: 18 },
];

// Define default behavior for the component
export const Default = Template.bind({});
Default.args = {
  ID: 1,
  listTitle: 'Order List',
  items: sampleItems,
  removeOrder: (order) => alert(`Removed order: ${order.name}`),
  moveForward: (order) => alert(`Move forward order: ${order.name}`),
  moveBackward: (order) => alert(`Move backward order: ${order.name}`),
};

// Define a case with no items
export const EmptyList = Template.bind({});
EmptyList.args = {
  ID: 2,
  listTitle: 'Empty List',
  items: [],
  removeOrder: () => {},
  moveForward: () => {},
  moveBackward: () => {},
};
