import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function PasswordInput({ placeholder = "Password", ...props }) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => {
    console.log("Toggled:", !isShowPassword);
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center w-full text-sm bg-transparent border-[1.5px] px-5 rounded mb-4 outline outline-gray-300 border-gray-300">
      <input
        type={isShowPassword ? "text" : "password"}
        {...props}
        placeholder={placeholder}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />
      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-blue-500 cursor-pointer"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-slate-400 cursor-pointer"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
}

export default PasswordInput;
