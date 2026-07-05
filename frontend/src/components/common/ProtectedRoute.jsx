// import React from "react";

// import {
//   Navigate,
//   useLocation,
// } from "react-router-dom";

// import Loader from "./Loader";

// import { useAuth } from "../../hooks/useAuth";

// const ProtectedRoute = ({
//   children,
// }) => {
//   const {
//     authenticated,
//     loading,
//   } = useAuth();

//   const location = useLocation();

//   if (loading) {
//     return <Loader />;
//   }

//   if (!authenticated) {
//     return (
//       <Navigate
//         to="/login"
//         replace
//         state={{
//           from: location,
//         }}
//       />
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;