import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function sendOtp() {
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/users/send-otp", {
        email: email,
      })
      .then((response) => {
        setEmailSent(true);
        toast.success("OTP sent to your email");
      })
      .catch((error) => {
        setEmailSent(false);
        toast.error("Error sending OTP");
      });
  }

  function resetPassword() {
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/users/verify-otp", {
        email: email,
        otp: otp,
        newPassword: newPassword,
      })
      .then((response) => {
        toast.success("Password reset successful");
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Error resetting password");
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h2>

        {!emailSent && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Enter your email address to receive an OTP
            </p>

            <input
              type="email"
              placeholder="example@email.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Send OTP
            </button>
          </div>
        )}

        {emailSent && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              OTP has been sent to your email
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={resetPassword}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
