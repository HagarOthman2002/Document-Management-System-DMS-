import { FaFolder } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import {
  MdOutlineFileDownload,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";


const WorkSpcaeCard = ({ folderName, workspaceData, onRename, onDelete, onOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div
        className="flex bg-slate-100 p-5 justify-between items-center rounded-xl hover:shadow-md cursor-pointer"
        onDoubleClick={() => onOpen(workspaceData)}
        title="Double-click to open"
      >
        <div className="flex gap-2 items-center">
          <FaFolder className="text-xl text-gray-700" />
          <p>{folderName}</p>
          
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <BsThreeDotsVertical className="cursor-pointer" />
        </button>
      </div>

      {isMenuOpen && (
        <ul
          ref={menuRef}
          className="absolute right-3 top-16 bg-white shadow-md rounded-md z-10 w-40"
        >
          <li
            onClick={() => onRename(workspaceData)}
            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
          >
            <MdDriveFileRenameOutline />
            Rename
          </li>
          <li
            onClick={() => onDelete(workspaceData)}
            className="px-4 py-2 flex items-center gap-2 hover:bg-red-100 text-red-500 cursor-pointer"
          >
            <IoTrashOutline />
            Move to Trash
          </li>
          <li></li>
        </ul>
        
      )}
    </div>
  );
};

export default WorkSpcaeCard;