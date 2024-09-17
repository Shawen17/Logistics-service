import React from 'react';
import Header from '../components/Header/Header';

interface PageWrapperProps {
  children:
    | string
    | JSX.Element
    | (string | JSX.Element)[]
    | (() => JSX.Element);
}

const links = [
  { label: 'Home', url: '/' },
  { label: 'Products', url: '/products' },
  { label: 'Orders', url: '/orders' },
  { label: 'Picker', url: '/picker' },
  { label: 'Logout', url: '/logout' },
];

const PageWrapper = (props: PageWrapperProps) => (
  <>
    <div className="sticky top-0">
      <Header links={links} />
    </div>
    <div className="flex flex-col items-center justify-center p-4 h-full">
      {props.children}
    </div>
  </>
);

export default PageWrapper;
