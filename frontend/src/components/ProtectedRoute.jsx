import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, access, initialized } = useSelector((state) => state.auth);

  if (!access) {
    return <Navigate to="/login" />;
  }

  if (!initialized) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;