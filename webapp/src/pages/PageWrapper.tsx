import React from 'react';
import Header from '../components/Header/Header';
import { connect } from 'react-redux';
import { RootState } from '../components/interfaces';
import { HeaderLink } from '../components/interfaces';

interface PageWrapperProps {
  children:
    | string
    | JSX.Element
    | (string | JSX.Element)[]
    | (() => JSX.Element);
}

const navItem: HeaderLink[] = [
  { label: 'Home', url: '/' },
  { label: 'Products', url: '/products' },
  { label: 'Orders', url: '/orders' },
  { label: 'Picker', url: '/picker' },
  { label: 'Logout', url: '/logout' },
  { label: 'Activity', url: '/activity' },
  { label: 'Delivery', url: '/delivery' },
];

const PageWrapper: React.FC<
  PageWrapperProps & { role: string } & { isAuthenticated: boolean }
> = ({ children, role, isAuthenticated }) => {
  const allowed = ['team_lead', 'manager'];
  let links: HeaderLink[];

  if (!isAuthenticated) {
    links = [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
    ];
  } else {
    links = allowed.includes(role) ? navItem : navItem.slice(0, 5);
  }
  return (
    <>
      <div className="sticky top-0">
        <Header links={links} />
      </div>
      <div className="flex flex-col items-center justify-center p-4 h-full">
        {children}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  role: state.auth.role,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(PageWrapper);
