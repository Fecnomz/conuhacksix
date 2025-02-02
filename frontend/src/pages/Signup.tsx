import { Input } from "@heroui/react";
import { Link } from "react-router-dom";

export default function Signup() {
  // Function to restrict non-numeric input
  const handlePhoneNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""); // Replace non-digit characters
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md p-8">
        {/* Sign-Up Form Header */}
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Create Account</h1>
        <p className="text-gray-500 mb-6">Join us today!</p>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <Input label="Company Name" type="text" />
          <Input label="Email" type="email" />
          <Input 
            label="Phone Number" 
            type="tel" 
            onInput={handlePhoneNumberInput} 
          />
          <Input label="Password" type="password" />
          <Input label="Confirm Password" type="password" />
        </div>

        {/* Sign-Up Button */}
        <button className="w-full mt-6 p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
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