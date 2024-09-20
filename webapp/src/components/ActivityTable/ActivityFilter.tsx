import { ChangeEvent, FormEvent } from 'react';
import {
  FilterContainer,
  Input,
  SearchItem,
  SearchTitle,
  SearchButton,
  SearchItems,
} from './ActivityTable.style';
import { searchValue } from '../../pages/Performance/Performance';

interface InputProps {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  input: searchValue;
  handleSubmit: (event: FormEvent) => void;
}

const ActivityFilter: React.FC<InputProps> = ({
  input,
  handleChange,
  handleSubmit,
}) => {
  return (
    <>
      <FilterContainer onSubmit={handleSubmit}>
        <SearchItems>
          <SearchItem>
            <SearchTitle>OrderID</SearchTitle>
            <Input
              type="number"
              name="order"
              value={input.order || ''}
              onChange={handleChange}
            />
          </SearchItem>
          <SearchItem>
            <SearchTitle>StaffID</SearchTitle>
            <Input
              type="number"
              name="staff"
              value={input.staff || ''}
              onChange={handleChange}
            />
          </SearchItem>
          <SearchItem>
            <SearchTitle>CheckedBy</SearchTitle>
            <Input
              type="number"
              name="checked_by"
              value={input.checked_by || ''}
              onChange={handleChange}
            />
          </SearchItem>
          <SearchItem>
            <SearchTitle>Start Date</SearchTitle>
            <Input
              type="date"
              name="start_date"
              value={input.start_date || ''}
              onChange={handleChange}
            />
          </SearchItem>
          <SearchItem>
            <SearchTitle>End Date</SearchTitle>
            <Input
              type="date"
              name="end_date"
              value={input.end_date || ''}
              onChange={handleChange}
            />
          </SearchItem>
        </SearchItems>
        <SearchButton type="submit">Search</SearchButton>
      </FilterContainer>
    </>
  );
};

export default ActivityFilter;
