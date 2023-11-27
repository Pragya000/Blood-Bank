import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home";
import PublicRoute from "../components/common/Route/PublicRoute";
import PrivateRoute from "../components/common/Route/PrivateRoute";
import Login from "../pages/login";
import Signup from "../pages/signup";
import VerifyOtp from "../pages/verifyotp";
import Error from "../pages/error";
import Profile from "../pages/profile";

export default function RouterProviderMain() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <PublicRoute>
        <Login />
      </PublicRoute> 
      ,
    },
    {
      path: "/signup",
      element: <PublicRoute>
        <Signup />
      </PublicRoute>,
    },
    {
      path: "/verify-otp",
      element: <PublicRoute>
        <VerifyOtp />
      </PublicRoute>,
    },
    {
      path: '/profile',
      element: <PrivateRoute>
        <Profile />
      </PrivateRoute>
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);
  return <RouterProvider router={router} />;
}
