import Sidebar from "./sideBar";
import Navbar from "./navbar/Navbar"; // ✅ Import Navbar
import { Outlet } from "react-router-dom";

// Optional: pass these props from router if needed
const Layout = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  handleSearch,
  onClearSearch,
}) => {
  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar
          userInfo={userInfo}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
        <div className="flex-1 p-4 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

