import { Navigate } from "react-router-dom";
import { useUser } from "../../../store/useUser";
import PropTypes from 'prop-types'

export default function PublicRoute({ children }) {
  const { isAuth } = useUser();

  if (!isAuth) {
    return children;
  } else {
    return <Navigate to="/profile" />;
  }
}

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
}