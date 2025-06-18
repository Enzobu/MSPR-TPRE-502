import type { ReactNode } from "react";
import Navbar from "../Navbar/Navbar";
import "./Layout.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content" role="main" id="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 