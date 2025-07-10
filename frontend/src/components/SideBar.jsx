import logo from "../assets/Logo.png";
import { IoMdHome } from "react-icons/io";
import { FaGoogleDrive } from "react-icons/fa";
import { MdDevices, MdOutlineFolderShared } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";
import { RiSpam2Line } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import {useState} from "react"
import { NavLink } from "react-router-dom";

const menuItems = [
  { icon: <IoMdHome />, label: "Home", path: "/home" },
  { icon: <FaGoogleDrive />, label: "My Drive", path: "/drive" },
  { icon: <MdDevices />, label: "Computers", path: "/computers" },
  { icon: <MdOutlineFolderShared />, label: "Shared with me", path: "/shared" },
  { icon: <CiClock2 />, label: "Recent", path: "/recent" },
  { icon: <RiSpam2Line />, label: "Spam", path: "/spam" },
  { icon: <FaRegTrashCan />, label: "Trash", path: "/trash" },
];


const Sidebar = () => {
  const [activeLabel , setActiveLabel] = useState("My Drive")
  
  return (
    <div className="w-100 min-h-screen px-4 py-6 bg-slate-100 hidden md:block ">
      {/* Logo */}
      <div className="flex items-center mb-10">
        <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
        <span className="text-lg font-semibold text-gray-700">Drive</span>
      </div>

      <button
        className="flex gap-2 items-center  rounded-2xl px-5 py-2 bg-white shadow-lg hover:bg-slate-100 mb-5 cursor-pointer" 
      >
        {" "}
        <IoMdAdd /> New
      </button>
      {/* Menu */}
      <nav className="space-y-8">
        {menuItems.map((item, index) => (
          <NavLink
          to={item.path}
          onClick={() => setActiveLabel(item.label)}
            key={index}
            href="#"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all ${
             activeLabel  === item.label ? "bg-blue-100 text-blue-700" : ""
            }`}
          >
            <span className="text-xl mr-3">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
