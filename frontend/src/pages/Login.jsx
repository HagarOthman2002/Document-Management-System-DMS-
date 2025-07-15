import LoginImg from "../assets/LoginSignUp.png";
import Logo from "../assets/driveLogo.png";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import PasswordInput from "../components/input/PasswordInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("Both fields are required");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. please try again."
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen overflow-hidden">
      <div className="w-full lg:w-1/2 h-64 lg:h-full">
        <img
          src={LoginImg}
          alt="Login visual"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-10">
        <div className="mb-8">
          <img src={Logo} alt="Logo" className="h-16 mx-auto" />
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 text-[#313237]">
          Log in
        </h2>
        <p className="text-sm md:text-base lg:text-lg  mb-8 font-medium text-[#4E4E4E]">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="John@empresa.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="*******"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-gray-600">Remember password</span>
            </label>
            <a href="#" className="text-blue-500 hover:underline">
              Forgot my password
            </a>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button>Log In</Button>
        </form>

        <p className="text-xs text-gray-400 mt-20 text-center">
          POWERED BY <span className="font-semibold text-black">nocodb</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
