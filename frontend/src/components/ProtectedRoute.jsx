
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ userInfo }) => {
  if (userInfo === null) {

    return <div>Loading...</div>;
  }

  return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
