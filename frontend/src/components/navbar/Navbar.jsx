import { useNavigate } from "react-router-dom";

import ProfileInfo from "../Cards/profileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { CiSettings } from "react-icons/ci";

const Navbar = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  handleSearch,
  onClearSearch,
}) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className=" bg-slate-100 flex items-center justify-between px-6 py-2 sm:gap-2 drop-shadow">
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <div className="flex items-center gap-2">
        <CiSettings className="text-3xl text-slate-500 curosr-Pointer hover:text-black" />
        <ProfileInfo userInfo={userInfo} onLogOut={onLogout} />
      </div>
    </div>
  );
};

export default Navbar;
