import logo from "../assets/driveLogo.png";
import { IoMdHome, IoMdAdd } from "react-icons/io";
import { FaGoogleDrive } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import { RiSpam2Line } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  MdUploadFile,
  MdDriveFolderUpload,
  MdOutlineCreateNewFolder,
  MdDevices,
  MdOutlineFolderShared,
} from "react-icons/md";
import axiosInstance from "../utils/axiosInstance";

const menuItems = [
  { icon: <IoMdHome />, label: "Home", path: "/home" },
  { icon: <FaGoogleDrive />, label: "My Drive", path: "/drive" },

  { icon: <MdOutlineFolderShared />, label: "Shared with me", path: "/shared" },
  { icon: <CiClock2 />, label: "Recent", path: "/recent" },
  { icon: <RiSpam2Line />, label: "Spam", path: "/spam" },
  { icon: <FaRegTrashCan />, label: "Trash", path: "/trash" },
];

const Sidebar = ({ userInfo, getAllDocuments, getAllWorkSpaces }) => {
  console.log("Sidebar userInfo:", userInfo);
  const [activeLabel, setActiveLabel] = useState("Home");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleFileUpload = async (e) => {
  if (!userInfo?.id) {
    alert("User not logged in");
    return;
  }

  const files = e.target.files;
  console.log("Files received for upload:", files);
  if (!files || files.length === 0) return;

  const formData = new FormData();
  const workspaceId = localStorage.getItem("currentWorkspaceId");
  if (!workspaceId) {
    alert("No workspace selected");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    console.log("Appending file:", files[i]);
    formData.append("document", files[i]); 
  }

  formData.append("owner", userInfo.id);
  formData.append("workSpaceId", workspaceId);


  for (let [key, val] of formData.entries()) {
    console.log("FormData:", key, val);
  }

  try {
   await axiosInstance.post("/documents/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

    alert("File(s) uploaded!");
    if (getAllDocuments) getAllDocuments();
  } catch (err) {
    console.error("Upload failed", err);
  }
};



  const handleFolderUpload = async (e) => {
    console.log("Files from folder upload:", e.target.files);

    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (!userInfo || !userInfo.id || !userInfo.nid) {
      alert("User not logged in");
      return;
    }

    const foldersMap = {};
    files.forEach((file) => {
      const folderName = file.webkitRelativePath.split("/")[0];
      if (!foldersMap[folderName]) foldersMap[folderName] = [];
      foldersMap[folderName].push(file);
    });

    for (const [folderName, folderFiles] of Object.entries(foldersMap)) {
      try {
        const workspaceResponse = await axiosInstance.post("/workspaces", {
          name: folderName,
          nid: userInfo.nid,
          description: `Uploaded from folder ${folderName}`,
        });

        const newWorkspaceId = workspaceResponse.data?.workspace?._id;
        if (!newWorkspaceId) {
          console.error("Workspace creation failed for", folderName);
          continue;
        }

        const formData = new FormData();
        folderFiles.forEach((file) => {
          formData.append("document", file);
        });

        formData.append("owner", userInfo.id);
        formData.append("workSpaceId", newWorkspaceId);

        await axiosInstance.post("/documents/upload", formData, {
         
        });

        console.log(`Folder "${folderName}" uploaded successfully.`);
      } catch (error) {
        console.error(` Error uploading folder "${folderName}":`, error);
      }
    }

    alert("All folders uploaded!");
    if (getAllWorkSpaces) getAllWorkSpaces();
    if (getAllDocuments) getAllDocuments();
  };
  const fileInputRef = useRef(null);

  return (
    <div className="w-100 min-h-screen px-4 py-6 bg-slate-100 hidden md:block relative">
      <a className="flex items-center mb-10 cursor-pointer">
        <img src={logo} alt="Logo" className="h-30  mr-2" />
        <span className="text-3xl font-extrabold text-gray-700">Drive</span>
      </a>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex gap-2 items-center rounded-2xl px-8 py-4 bg-white text-xl font-medium shadow-lg hover:bg-slate-100 mb-5 cursor-pointer"
        >
          <IoMdAdd /> New
        </button>

        {showDropdown && (
          <div className="absolute left-30 top-16  z-10 bg-white rounded-md shadow-md w-48">
            <button
              disabled={!userInfo}
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2"
            >
              <MdUploadFile />
              Upload File
            </button>
            <button
              disabled={!userInfo}
              onClick={() => document.getElementById("folderInput").click()}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2"
            >
              <MdDriveFolderUpload />
              Upload Folder
            </button>

            <button
              // onClick={() => alert("Create folder logic here")}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2"
            >
              <MdOutlineCreateNewFolder />
              New Folder
            </button>
          </div>
        )}

        <input
          type="file"
          multiple
          name="document"
         
          style={{ display: "none" }}
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
        <input
          type="file"
          id="folderInput"
          style={{ display: "none" }}
          webkitdirectory="true"
          directory=""
          multiple
          onChange={handleFolderUpload}
        />
      </div>

      <nav className="space-y-8 mt-4">
        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            onClick={() => setActiveLabel(item.label)}
            key={index}
            className={`flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all ${
              activeLabel === item.label ? "bg-blue-100 text-blue-700" : ""
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
