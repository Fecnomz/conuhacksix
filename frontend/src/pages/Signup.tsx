import { useState } from "react";
import { Input } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePhoneNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value.replace(/\D/g, ""));
  };

  const handleSignup = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName, email, phoneNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setShowSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md p-8">
        {/* Sign-Up Form Header */}
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Create Account</h1>
        <p className="text-gray-500 mb-6">Join us today!</p>

        {/* Display error messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Success Pop-up */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            Signup successful! Redirecting to login page...
          </div>
        )}

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <Input label="Company Name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Phone Number" type="tel" value={phoneNumber} onChange={handlePhoneNumberInput} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        {/* Sign-Up Button */}
        <button
          onClick={handleSignup}
          className="w-full mt-6 p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Sign Up
        </button>

        {/* Login Redirect */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}