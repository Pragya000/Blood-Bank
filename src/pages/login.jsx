import MyImage from "../components/common/MyImage";
import useCustomTitle from "../hooks/useCustomTitle";
import { useState } from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useCustomTitle("Blood Connect | Login");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password");
    } else {
      // Perform login logic here
      setError("");
      // Redirect to dashboard or perform any other action
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/">
        <MyImage alt="Blood Connect" src={Logo} className="w-[160px]" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white rounded-md px-4 py-2"
      >
        Login
      </button>
    </div>
  );
}
