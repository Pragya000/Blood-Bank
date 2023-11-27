import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import useCustomTitle from "../hooks/useCustomTitle";
import Logo from "../assets/logo.png";
import MyImage from "../components/common/MyImage";

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [isOtpValid, setIsOtpValid] = useState(true);

    useCustomTitle("Blood Connect | Verify OTP");

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            setIsResendDisabled(false);
        }

        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (otp) => {
        setOtp(otp);
        setIsOtpValid(true);
    };

    const handleResendOtp = () => {
        // Logic to resend OTP
        setTimer(60);
        setIsResendDisabled(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation logic
        if (otp.length === 6) {
            // Logic to verify OTP
            console.log("OTP verified!");
        } else {
            setIsOtpValid(false);
        }
    };

    return (
        <div className="w-screen h-screen grid place-content-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <MyImage alt="Blood Connect" src={Logo} className="w-[160px]" />
            <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
                <OtpInput
                    value={otp}
                    onChange={handleOtpChange}
                    numInputs={6}
                    shouldAutoFocus={true}
                    containerStyle={{
                        justifyContent: "center",
                        gap: '10px'  
                    }}
                    renderInput={(props) => (
                        <input
                          {...props}
                          type="number"
                          placeholder="0"
                          pattern="\d*"
                          className={`!w-[32px] h-[32px] !aspect-square border ${isOtpValid ? 'border-black' : 'border-red-500'} text-center`}
                        />
                      )}
                />
                {!isOtpValid && <p className="text-red-500">Invalid OTP!</p>}
                <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">Verify</button>
            <div className="flex items-center">
                {timer > 0 ? (
                    <p>Resend OTP in {timer} seconds</p>
                ) : (
                    <button type="button" onClick={handleResendOtp} disabled={isResendDisabled} className="bg-blue-500 text-white rounded-md px-4 py-2">
                        Resend OTP
                    </button>
                )}
            </div>
            </form>
        </div>
    );
}