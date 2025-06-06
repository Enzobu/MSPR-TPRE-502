import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

interface Props {
  children: ReactNode;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default RequireAuth;
