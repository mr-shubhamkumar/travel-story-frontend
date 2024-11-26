import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import signupImg from "../../assets/img/signup.png";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { validateEmail } from "../../utils/helper";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // VALIDATE INPUTS
    if (!fullname) {
      setError("please enter the FullName.");
      return;
    }
    if (!validateEmail(email)) {
      setError("please a valid email address.");
      return;
    }
    if (!password) {
      setError("please enter the password");
      return;
    }
    setError("");
    // VALIDATE INPUTS

    // API call for Signup using Axios instance
    try {
      const response = await axiosInstance.post("/create-account", {
        fullname,
        email,
        password,
      });

      // Handle successful signup response
      if (response.data && response.data.accessToken) {
        // Store the token in localStorage
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
        
      }

      console.log("Login successful:", response.data);
    } catch (error) {
      // Handle errors
      setError(
        error.response?.data?.message || "signup failed. Please try again."
      );
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#E6F7FF]">
      <div className="w-1/2 relative overflow-hidden">
        <img
          src={signupImg}
          alt="Tropical island with palm trees and clear water"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex flex-col justify-end p-12">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Join the Adventure
          </h1>
          <p className="text-xl text-white">
            Create an account to start documenting your travels and preserving
            your memories in your personal travel journal.
          </p>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="w-96 p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-900">
            Login
          </h2>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <Input
                value={fullname}
                onChange={({ target }) => {
                  setFullname(target.value);
                }}
                id="fullname"
                type="text"
                placeholder="Name"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Input
                value={email}
                onChange={({ target }) => {
                  setEmail(target.value);
                }}
                id="email"
                type="email"
                placeholder="Email"
                className="w-full"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                value={password}
                onChange={({ target }) => {
                  setPassword(target.value);
                }}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#00B4D8] hover:bg-[#0096B4]"
            >
              Sign up
              
            </Button>
          </form>
          <div className="mt-6 text-center">
            {error && <p className="text-red-500 text-xs pb-0">{error}</p>}
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login">
                <a className="text-[#00B4D8] hover:underline">LOG IN</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
