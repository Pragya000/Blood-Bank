import { createBrowserRouter, RouterProvider, useParams } from "react-router-dom";
import Home from "../pages/home";
import PublicRoute from "../components/common/Route/PublicRoute";
import PrivateRoute from "../components/common/Route/PrivateRoute";
import AdminRoute from "../components/common/Route/AdminRoute";
import Login from "../pages/login";
import Signup from "../pages/signup";
import VerifyOtp from "../pages/verifyotp";
import Error from "../pages/error";
import Profile from "../pages/profile";
import AdminHome from "../components/core/AdminAccount/Home";
import HospitalsList from "../components/core/AdminAccount/HospitalsList";
import PopulateUser from "../components/core/AdminAccount/PopulateUser";

export default function RouterProviderMain() {

  const DynamicAdminComponent = () => {
    const { path } = useParams();
    // Handle different dynamic routes here
    switch (path) {
      case 'home':
        return <AdminHome />;
      case 'hospitals-list':
        return <HospitalsList/>;
      case 'populate-user':
        return <PopulateUser />
      default:
        return <Error />;
    }
  };

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
      </PrivateRoute>,
      children: [
        {
          path: 'admin/:path',
          element: <AdminRoute>
            <DynamicAdminComponent />
          </AdminRoute>
        }
      ]
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);
  return <RouterProvider router={router} />;
}
