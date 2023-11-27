import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import MyImage from "../components/common/MyImage";
import { useUser } from "../store/useUser";

export default function Home() {
  const { isAuth } = useUser();
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen grid place-content-center">
      <MyImage alt="Blood Connect" src={Logo} className="w-[250px]" />
      <button
        onClick={() => {
          if (isAuth) navigate("/profile");
          else navigate("/login");
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-10"
      >
        Get Started
      </button>
    </div>
  );
}
