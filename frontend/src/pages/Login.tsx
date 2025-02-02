import { useState } from "react";
import { Input } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import image from "../assets/ConvoServeLogin.jpg";
import Title from "../components/Title"; // Import Title
import image2 from "../assets/ConvoServeLogo.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-4 relative">
      {/* Title Component Positioned at Top Left */}
      <div className="absolute top-0 left-0">
        <Title imageSrc={image2} />
      </div>

      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-xl md:max-w-3xl">
        {/* Left Section (Image Placeholder) */}
        <div className="hidden md:flex w-1/2 bg-blue-900 items-center justify-center" style={{userSelect: "none"}}>
          <img src={image} alt="Login image" className="w-full h-full object-cover" />
        </div>

        {/* Right Section (Login Card) */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-2" style={{userSelect: "none"}}>Login</h1>
          <p className="text-gray-500 mb-6" style={{userSelect: "none"}}>Easier than speaking</p>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex flex-col gap-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {/* Additional Options */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember" className="text-sm text-gray-600" style={{userSelect: "none"}}>
                Remember Me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-500 hover:underline" style={{userSelect: "none"}}>
              Forgot your password?
            </a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full mt-6 p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            style={{userSelect: "none"}}
          >
            LOGIN
          </button>

          {/* Create Account Link */}
          <div className="text-center mt-4">
            <Link to="/signup" className="text-sm text-gray-500 hover:underline" style={{userSelect: "none"}}>
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
