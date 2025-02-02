import { Input } from "@heroui/react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-xl md:max-w-3xl">
        
        {/* Left Section (Image or Illustration Placeholder) */}
        <div className="hidden md:flex w-1/2 bg-blue-900 items-center justify-center p-8">
          <div className="text-white text-xl font-bold">Illustration Here</div>
        </div>

        {/* Right Section (Login Card) */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">Login</h1>
          <p className="text-gray-500 mb-6">Easier than speaking</p>
          
          <div className="flex flex-col gap-4">
            <Input label="Email" type="email" />
            <Input label="Password" type="password" />
          </div>

          {/* Additional Options */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember</label>
            </div>
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot your password?</a>
          </div>

          {/* Button */}
          <button className="w-full mt-6 p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
            NEXT
          </button>

          {/* Create Account Link */}
          <div className="text-center mt-4">
            <Link to="/signup" className="text-sm text-gray-500 hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
