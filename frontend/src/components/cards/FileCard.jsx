import { AiOutlineFilePdf, AiOutlineFileText } from "react-icons/ai";
import { FaFileImage } from "react-icons/fa";

const FileCard = ({ file }) => {
  const getFileIcon = (type) => {
    if (type?.includes("pdf")) return <AiOutlineFilePdf className="text-3xl text-red-500" />;
    if (type?.includes("image")) return <FaFileImage className="text-3xl text-blue-400" />;
    if (type?.includes("text")) return <AiOutlineFileText className="text-3xl text-gray-500" />;
    return <AiOutlineFileText className="text-3xl text-gray-400" />;
  };

  return (
    <div
      onDoubleClick={() => window.open(file.fileUrl, "_blank")}
      title="Double-click to open"
      className="bg-slate-100 rounded shadow p-3 flex flex-col items-center justify-between hover:shadow-md transition duration-200 cursor-pointer"
    >
      <div className="mb-2">{getFileIcon(file.type)}</div>
      <p className="text-sm text-center truncate w-full">{file.name}</p>
    </div>
  );
};

export default FileCard;
