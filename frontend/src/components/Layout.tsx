import React, { PropsWithChildren } from 'react';
import Header from './Header';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen ">
      <Header />
      <section className="h-full py-8 container">{children}</section>
    </div>
  );
};

export default Layout;
