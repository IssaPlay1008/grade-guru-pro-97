
import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Layout from "./Layout";

interface LayoutWrapperProps {
  isMobile: boolean;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ isMobile }) => {
  return (
    <Layout isMobile={isMobile}>
      <Outlet />
    </Layout>
  );
};

export default LayoutWrapper;
