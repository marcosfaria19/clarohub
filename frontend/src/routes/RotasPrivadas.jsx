// RotasPrivadas.jsx
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const RotasPrivadas = ({ children, ...rest }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const userPermissions = decoded.permissions || [];

    if (!userPermissions.includes(rest.path.slice(1))) {
      return <Navigate to="/login" />;
    }

    return children;
  } catch (e) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
};

export default RotasPrivadas;
