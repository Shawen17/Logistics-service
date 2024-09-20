import { Activity } from '../interfaces';
import React, { useState, useEffect } from 'react';
import { StyledTable } from './ActivityTable.style';

interface ActivityTableProps {
  titles: string[];
  activities: Activity[];
}

const ActivityTable: React.FC<ActivityTableProps> = ({
  titles,
  activities,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <StyledTable
      className={`transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <thead>
        <tr>
          {titles.map((title, index) => (
            <th key={index}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <tr key={activity.ActivityID}>
            <td>{activity.OrderID}</td>
            <td>{activity.Staff}</td>
            <td>{activity.StartTime.toLocaleString()}</td>
            <td>
              {activity.EndTime ? activity.EndTime.toLocaleString() : 'N/A'}
            </td>
            <td>{activity.Duration ? activity.Duration : 0}</td>
            <td>{activity.CheckedBy || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default ActivityTable;
