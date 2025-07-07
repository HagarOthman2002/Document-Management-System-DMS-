import { useNavigate } from "react-router-dom";

import ProfileInfo from "../Cards/profileInfo";
import SearchBar from "../SearchBar/SearchBar";

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
    <div className="bg-white flex items-center justify-between px-6 py-2 sm:gap-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Products</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogOut={onLogout} />
    </div>
  );
};

export default Navbar;
