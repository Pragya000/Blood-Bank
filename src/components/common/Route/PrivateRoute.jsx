import { Navigate } from "react-router-dom";
import { useUser } from "../../../store/useUser";
import PropTypes from 'prop-types'

export default function PrivateRoute({ children }) {
  const { isAuth } = useUser();

  if (isAuth) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
}