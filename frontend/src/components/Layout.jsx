import Sidebar from "./SideBar";
import Navbar from "./navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSearch } from "../contexts/SearchContext";
import { useDocuments } from "../contexts/DocumentsContext";

const Layout = ({ userInfo }) => {
  const { searchQuery, sort, order, type, setSearchQuery } = useSearch();
  const { getAllDocuments } = useDocuments();

  useEffect(() => {
    const workspaceId = localStorage.getItem("currentWorkspaceId");
    if (!workspaceId) return;

    getAllDocuments(workspaceId, searchQuery, sort, order, type);
  }, [searchQuery, sort, order, type, getAllDocuments]);

  const handleSearch = () => {
    const workspaceId = localStorage.getItem("currentWorkspaceId");
    if (workspaceId) getAllDocuments(workspaceId, searchQuery, sort, order, type);
  };

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar userInfo={userInfo} />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar
          userInfo={userInfo}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
        <div className="flex-1 p-4 rounded-4xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
