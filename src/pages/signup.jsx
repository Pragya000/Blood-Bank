import MyImage from "../components/common/MyImage";
import useCustomTitle from "../hooks/useCustomTitle";
import { useState } from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("");
    const [error, setError] = useState("");

    useCustomTitle("Blood Connect | Signup");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleAccountTypeChange = (e) => {
        setAccountType(e.target.value);
    };

    const handleSignup = () => {
        if (!email || !password || !accountType) {
            setError("Please fill in all fields");
        } else {
            // Perform signup logic here
            setError("");
            // Redirect to dashboard or perform any other action
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Link to='/'>
            <MyImage alt="Blood Connect" src={Logo} className="w-[160px]" />
            </Link>
            <h1 className="text-2xl font-bold mb-4">Signup</h1>
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
            <div className="flex items-center mb-4 gap-4">
            <div className="flex items-center ">
                <input
                    type="radio"
                    id="user"
                    name="accountType"
                    value="user"
                    checked={accountType === "user"}
                    onChange={handleAccountTypeChange}
                    className="mr-2"
                />
                <label htmlFor="user">User</label>
            </div>
            <div className="flex items-center">
                <input
                    type="radio"
                    id="hospital"
                    name="accountType"
                    value="hospital"
                    checked={accountType === "hospital"}
                    onChange={handleAccountTypeChange}
                    className="mr-2"
                />
                <label htmlFor="hospital">Hospital</label>
            </div>
            </div>
            <button
                onClick={handleSignup}
                className="bg-blue-500 text-white rounded-md px-4 py-2"
            >
                Signup
            </button>
        </div>
    );
}
