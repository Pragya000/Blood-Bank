import { Navigate } from "react-router-dom";
import { useUser } from "../../../store/useUser";
import PropTypes from 'prop-types'

export default function AdminRoute({ children }) {
  const { isAuth, user } = useUser();

  if (isAuth && user?.accountType === "Admin") {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
}