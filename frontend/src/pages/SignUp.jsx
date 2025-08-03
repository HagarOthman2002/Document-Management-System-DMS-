import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/helper"; 
import Input from "../components/input/Input";
import PasswordInput from "../components/input/PasswordInput";
import Button from "../components/button/Button";
import Logo from "../assets/driveLogo.png";
import signUpImg from "../assets/LoginSignUp.png";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nId: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { name, email, password, nId } = formData;

   
    if (!name || !email || !password || !nId) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!/^\d{14}$/.test(nId)) {
      setError("National ID must be exactly 14 digits.");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/register", {
        name,
        email,
        password,
        nid: nId,
      });

      if (response.data?.error) {
        setError(response.data.message);
        return;
      }

      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen overflow-hidden">
      <div className="w-full lg:w-1/2 h-64 lg:h-full">
        <img
          src={signUpImg}
          alt="Sign Up"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-10">
        <div className="mb-8">
          <img src={Logo} alt="Logo" className="h-16 mx-auto" />
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 text-[#313237]">
          Create an Account
        </h2>
        <p className="text-sm md:text-base mb-8 font-medium text-[#4E4E4E]">
          Please fill in the details below to sign up.
        </p>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <PasswordInput
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              National ID
            </label>
            <Input
              type="text"
              name="nId"
              placeholder="12345678901234"
              value={formData.nId}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
          <Button>Sign Up</Button>
        </form>

        <p className="text-xs text-gray-400 mt-20 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 underline font-medium">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
