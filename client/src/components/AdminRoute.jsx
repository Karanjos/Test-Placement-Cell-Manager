import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && (currentUser.isAdmin || currentUser.isEmployer) ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};
export default AdminRoute;
