import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../contexts/SearchContext";

import ProfileInfo from "../Cards/profileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { CiSettings } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    setType,
    setTags,
    setDateFrom,
    setDateTo,
  } = useSearch();

  const [showFilters, setShowFilters] = useState(false);
  const [tempType, setTempType] = useState("");
  const [tempTags, setTempTags] = useState("");
  const [tempDateFrom, setTempDateFrom] = useState("");
  const [tempDateTo, setTempDateTo] = useState("");

  const filterRef = useRef(null);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const onClearSearch = () => setSearchQuery("");

  const applyFilters = () => {
    setType(tempType);
    setTags(
      tempTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    );
    setDateFrom(tempDateFrom);
    setDateTo(tempDateTo);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setTempType("");
    setTempTags("");
    setTempDateFrom("");
    setTempDateTo("");
    setType("");
    setTags([]);
    setDateFrom("");
    setDateTo("");
    setShowFilters(false);
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  return (
    <div className="relative bg-slate-100 flex items-center justify-between px-6 py-2 sm:gap-2">
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={() => {}}
        onClearSearch={onClearSearch}
      />
      <div className="flex items-center gap-3 relative">
   
        <button
          className="flex items-center gap-1 text-sm bg-white px-2 py-1 rounded-md shadow hover:bg-slate-200 transition"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <IoFilterSharp className="text-xl" />
          Filters
        </button>

      
        {showFilters && (
          <div
            ref={filterRef}
            className="absolute right-14 top-14 bg-white shadow-xl rounded-lg p-4 z-50 w-72"
          >
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full border border-slate-400 rounded px-2 py-1"
                value={tempType}
                onChange={(e) => setTempType(e.target.value)}
              >
                <option value="">All</option>
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="docx">DOCX</option>
                <option value="txt">Text</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                type="text"
                placeholder="e.g. invoice,report"
                className="w-full border border-slate-400 rounded px-2 py-1"
                value={tempTags}
                onChange={(e) => setTempTags(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Date From
              </label>
              <input
                type="date"
                className="w-full border border-slate-400 rounded px-2 py-1"
                value={tempDateFrom}
                onChange={(e) => setTempDateFrom(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Date To</label>
              <input
                type="date"
                className="w-full border border-slate-400 rounded px-2 py-1"
                value={tempDateTo}
                onChange={(e) => setTempDateTo(e.target.value)}
              />
            </div>

            <div className="flex justify-between mt-3">
              <button
                className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                onClick={applyFilters}
              >
                Apply
              </button>
              <button
                className="bg-gray-300 text-sm px-3 py-1 rounded hover:bg-gray-400"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        )}


        <CiSettings className="text-3xl text-slate-500 cursor-pointer hover:text-black" />
        <ProfileInfo userInfo={userInfo} onLogOut={onLogout} />
      </div>
    </div>
  );
};

export default Navbar;
