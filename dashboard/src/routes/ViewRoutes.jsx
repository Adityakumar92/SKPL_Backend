import { useSelector } from "react-redux";

const ViewRoutes = ({ children, moduleKey }) => {
  const { roleAndPermission, isAuthChecked } = useSelector(
    (state) => state.auth
  );

  // Wait until auth is checked to prevent flash of unauthorized
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  // If no permissions or no entry for this module
  if (!roleAndPermission || roleAndPermission[moduleKey] === "NA") {
    return <div className="text-center min-h-full font-bold">403 Forbidden</div>;
  }

  return children;
};

export default ViewRoutes;
