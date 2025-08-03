import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useSearch } from "../../contexts/SearchContext";
const SearchBar = ({ handleSearch, onClearSearch }) => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="w-150 flex items-center px-6 bg-slate-300 rounded-4xl ">
      <input
        type="text"
        placeholder="Search in Drive"
        className="w-full text-md font-semi-bold bg-transparent py-[20px] outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <IoMdClose
          className="text-xl text-slate-500 cursor-pointer hover:text-black"
          onClick={() => {
            setSearchQuery("");
            onClearSearch?.();
          }}
        />
      )}
      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
