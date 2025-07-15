import Sidebar from "./SideBar";
import Navbar from "./navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const Layout = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  handleSearch,
  onClearSearch,
}) => {
  const [documents, setDocuments] = useState([]);

  const getAllDocuments = async () => {
    const workspaceId = localStorage.getItem("currentWorkspaceId");
    if (!workspaceId) return;

    try {
      const response = await axiosInstance.get(
        `documents/${workspaceId}`
      );
      setDocuments(response.data.documents || []);
      console.log("Documents refreshed:", response.data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    getAllDocuments();
  }, []);

  return (
    <div className="flex min-h-screen ">
      <Sidebar userInfo={userInfo} getAllDocuments={getAllDocuments} />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar
          userInfo={userInfo}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
        <div className="flex-1 p-4 rounded-4xl">
          <Outlet context={{ documents }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
