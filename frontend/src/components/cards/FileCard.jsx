import { AiOutlineFilePdf, AiOutlineFileText } from "react-icons/ai";
import { FaFileImage } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { MdDelete, MdRestore, MdDeleteForever } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import { useState } from "react";
import Modal from "react-modal";

function base64ToUint8Array(base64) {
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

const FileCard = ({
  file,
  isTrashView = false,
  onRestored,
  onDeletedForever,
}) => {
  const [previewData, setPreviewData] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState(file.tags?.join(", ") || "");

  const getFileIcon = (type) => {
    if (type?.includes("pdf"))
      return <AiOutlineFilePdf className="text-3xl text-red-500" />;
    if (type?.includes("image"))
      return <FaFileImage className="text-3xl text-blue-400" />;
    if (type?.includes("text"))
      return <AiOutlineFileText className="text-3xl text-gray-500" />;
    return <AiOutlineFileText className="text-3xl text-gray-400" />;
  };

  const fetchPreview = async () => {
    try {
      const response = await axiosInstance.get(
        `/documents/preview/${file._id}`
      );
      const { base64Data, mimeType } = response.data.document;
      setPreviewData(base64Data);
      setMimeType(mimeType);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Preview failed:", error);
      alert("Failed to preview document.");
    }
  };

  const handleRestore = async (e) => {
    e.stopPropagation();
    try {
      await axiosInstance.patch(`/documents/${file._id}/restore`);
      onRestored?.(file._id);
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Failed to restore document.");
    }
  };

  const handleDeleteForever = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Permanently delete "${file.name}"?`)) return;
    try {
      await axiosInstance.delete(`/documents/${file._id}/permanent`);
      onDeletedForever?.(file._id);
    } catch (error) {
      console.error("Delete forever failed:", error);
      alert("Failed to delete file permanently.");
    }
  };

  const handleSoftDelete = async (e) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/documents/soft-delete/${file._id}`);
      onDeletedForever?.(file._id); 
    } catch (error) {
      console.error("Soft delete failed:", error);
      alert("Failed to delete document.");
    }
  };

  const handleTagSave = async (e) => {
    e.stopPropagation();
    try {
      const newTags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      await axiosInstance.patch(`/documents/${file._id}`, {
        tags: newTags,
      });
      file.tags = newTags;
      setIsEditingTags(false);
    } catch (error) {
      console.error("Failed to update tags:", error);
      alert("Failed to update tags.");
    }
  };

  return (
    <div
      onDoubleClick={fetchPreview}
      title="Double-click to preview"
      className="bg-slate-100 rounded shadow p-3 flex flex-col items-center justify-between hover:shadow-md transition duration-200 cursor-pointer relative"
    >
      <div className="mb-2">{getFileIcon(file.type)}</div>

      <div className="text-sm text-center w-full">
        <p className="truncate font-medium">{file.name}</p>
        {file.createdAt && (
          <p className="text-xs text-gray-500 mt-1">
            Created At: {new Date(file.createdAt).toLocaleString()}
          </p>
        )}

        <div className="text-xs text-gray-600 mt-1 w-full text-center">
          {file.tags && file.tags.length > 0 ? (
            <p>Tags: {file.tags.join(", ")}</p>
          ) : (
            <p>No tags</p>
          )}

          {!isTrashView && !isEditingTags ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTags(true);
              }}
              className="text-blue-500 underline text-xs mt-1"
            >
              Edit Tags
            </button>
          ) : null}

          {isEditingTags && (
            <div className="mt-1">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="border rounded px-2 py-0.5 text-xs w-3/4"
                placeholder="Comma-separated tags"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="ml-2 text-xs text-green-600 hover:underline"
                onClick={handleTagSave}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {isTrashView && file.deletedAt && (
        <p className="text-xs text-red-600 mt-1">
          Deleted At: {new Date(file.deletedAt).toLocaleString()}
        </p>
      )}

      <div className="flex gap-3 mt-2">
        <IoMdDownload
          title="Download file"
          onClick={async (e) => {
            e.stopPropagation();
            try {
              const response = await axiosInstance.get(
                `documents/download/${file._id}`,
                { responseType: "blob" }
              );
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", file.name);
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error("Download failed:", error);
              alert("Failed to download file.");
            }
          }}
          className="text-xl cursor-pointer hover:text-slate-600"
        />

        {!isTrashView && (
          <MdDelete
            title="Move to Trash"
            onClick={handleSoftDelete}
            className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
          />
        )}

        {isTrashView && (
          <>
            <MdRestore
              title="Restore"
              onClick={handleRestore}
              className="text-green-500 hover:text-green-700 cursor-pointer text-lg"
            />
            <MdDeleteForever
              title="Delete Forever"
              onClick={handleDeleteForever}
              className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
            />
          </>
        )}
      </div>

      <Modal
        isOpen={isPreviewOpen}
        onRequestClose={() => setIsPreviewOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.3)" },
          content: { width: "60%", margin: "auto", height: "80%" },
        }}
      >
        {mimeType?.startsWith("image/") && (
          <img
            src={`data:${mimeType};base64,${previewData}`}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              display: "block",
              margin: "auto",
            }}
          />
        )}

        {mimeType === "application/pdf" && previewData && (
          <iframe
            src={URL.createObjectURL(
              new Blob([base64ToUint8Array(previewData)], {
                type: "application/pdf",
              })
            )}
            title="PDF Preview"
            className="w-full h-full"
            style={{ minHeight: "600px" }}
          />
        )}

        {!mimeType?.startsWith("image/") && mimeType !== "application/pdf" && (
          <p>Preview not available.</p>
        )}
      </Modal>
    </div>
  );
};

export default FileCard;
