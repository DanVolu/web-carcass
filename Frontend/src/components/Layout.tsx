import React, { ReactNode } from "react";
import Navbar from "./Navbar"; // Adjust the path as necessary

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="mt-16">{children}</main>
    </>
  );
};

export default Layout;
