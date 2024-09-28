import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ActivityTable from './ActivityTable';
import { Activity } from '../interfaces';

// Set up the metadata for the component in Storybook
export default {
  title: 'Components/ActivityTable',
  component: ActivityTable,
} as ComponentMeta<typeof ActivityTable>;

// Create a template for the component
const Template: ComponentStory<typeof ActivityTable> = (args) => (
  <ActivityTable {...args} />
);

// Mock data for the activities
const mockActivities: Activity[] = [
  {
    ActivityID: 1,
    OrderID: 101,
    Staff: 1001,
    StartTime: new Date('2024-09-18T08:00:00'),
    EndTime: new Date('2024-09-18T12:00:00'),
    Duration: 240,
    CheckedBy: 1002,
    QAStart: new Date('2024-09-18T12:00:00'),
    QAEnd: new Date('2024-09-19T12:00:00'),
    QADuration: 3000,
  },
  {
    ActivityID: 2,
    OrderID: 102,
    Staff: 1003,
    StartTime: new Date('2024-09-18T09:00:00'),
    EndTime: null, // Activity still in progress
    Duration: 0,
    CheckedBy: null,
    QAStart: null,
    QAEnd: null,
    QADuration: 0,
  },
];

// Define how the component will look with props in the default scenario
export const Default = Template.bind({});
Default.args = {
  titles: [
    'Order ID',
    'Staff',
    'Start Time',
    'End Time',
    'Duration (minutes)',
    'Checked By',
    'QAStart',
    'QAEnd',
    'QADuration',
  ],
  activities: mockActivities,
};
