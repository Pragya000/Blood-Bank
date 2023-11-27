import MyImage from "../components/common/MyImage";
import AdminProfile from "../components/core/Profile/AdminProfile";
import HospitalProfile from "../components/core/Profile/HospitalProfile";
import UserProfile from "../components/core/Profile/UserProfile";
import useCustomTitle from "../hooks/useCustomTitle";
import { useUser } from "../store/useUser";
import Logo from "../assets/logo.png";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../services/apiConnector";
import { LOGOUT } from "../services/apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, setIsAuth, setUser } = useUser();
  const navigate = useNavigate();

  useCustomTitle("Blood Connect | Profile");

  const mutation = useMutation({
    mutationFn: () => {
      return apiConnector("POST", LOGOUT);
    },
    onSuccess: () => {
      setIsAuth(false);
      setUser(null);
      navigate("/login");
      toast.success("Logged Out Successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <>
      <div className="border border-b-gray-300 py-4">
        <div className="flex justify-between w-11/12 max-w-[1200px] mx-auto">
          <MyImage alt="Blood Connect" src={Logo} className="w-[160px]" />
          <button onClick={()=>mutation.mutate()} className="bg-blue-500 text-white rounded-md px-4 py-2">
            Logout
          </button>
        </div>
      </div>
      <div className="w-11/12 max-w-[1200px] mx-auto">
        {user?.accountType === "User" ? <UserProfile /> : null}
        {user?.accountType === "Hospital" ? <HospitalProfile /> : null}
        {user?.accountType === "Admin" ? <AdminProfile /> : null}
      </div>
    </>
  );
}
