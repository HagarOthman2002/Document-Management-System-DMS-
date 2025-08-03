import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditeWorkSpaces = ({
  workspaceData,
  type,
  getAllWorkSpaces,
  getAllDocuments,
  showToastMessage,
  userInfo,
  onClose,
}) => {
  const [title, setTitle] = useState(workspaceData?.title || "");
  const [description, setDescription] = useState(workspaceData?.content || "");
  const [documents, setDocuments] = useState([]);

  const [error, setError] = useState(null);

  const createWorkSpace = async () => {
    try {
      console.log("Creating workspace with:", {
        name: title,
        description,
        nid: userInfo?.nid,
      });
      const response = await axiosInstance.post("/workspaces", {
        name: title,
        description,
        nid: userInfo?.nid,
      });

      if (response.data && response.data.workspace) {
        showToastMessage("WorkSpace added successfully");
        await getAllWorkSpaces();
        onClose();
      } else {
        console.warn("Create workspace: Unexpected response:", response.data);
        setError("Failed to create workspace.");
      }
    } catch (error) {
      console.error("Create workspace error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const editeWorkspace = async () => {
    const workspaceId = workspaceData?._id;
    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }

    try {
      const response = await axiosInstance.put(`/workspaces/${workspaceId}`, {
        name: title,
        description,
      });

      if (response.data && response.data.workspace) {
        showToastMessage("Workspace updated successfully", "edit");
        await getAllWorkSpaces();
        onClose();
      } else {
        setError("Failed to update workspace.");
      }
    } catch (error) {
      console.error("Update workspace error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleCreateWorkSpaces = () => {
    if (!title) {
      setError("please Enter the title of the folder");
      return;
    }
    setError("");
    if (type == "edit") {
      editeWorkspace();
    } else {
      createWorkSpace();
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      if (type === "edit" && workspaceData?._id) {
        const docs = await getAllDocuments(workspaceData._id);
        setDocuments(docs || []);
      }
    };

    fetchDocuments();
  }, [type, workspaceData, getAllDocuments]);

  return (
    <div className="relative p-5 rounded-500 ">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center  absolute -top-3 -right-3 cursor-pointer  hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="text-3xl mb-5">
          {type === "edit" ? "Rename Folder" : "New Folder"}
        </label>
        <input
          type="text"
          className="text-2xl text-slate-950 border rounded-sm p-5 focus:outline-blue-600 mb-4"
          placeholder="untitled folder"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      {type === "edit" && (
        <div className="mt-4">

          {documents.length === 0 ? (
            <p className="text-slate-500 text-sm">No documents uploaded.</p>
          ) : (
            <ul className="text-sm text-slate-700 space-y-1 max-h-40 overflow-y-auto border p-2 rounded-sm bg-slate-50">
              {documents.map((doc) => (
                <li
                  key={doc._id}
                  onDoubleClick={() => window.open(doc.fileUrl, "_blank")}
                  className="flex justify-between items-center hover:bg-slate-100 p-1 rounded cursor-pointer"
                  title="Double-click to open"
                >
                  <span className="text-blue-600 hover:underline">
                    {doc.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        className="w-full bg-blue-600 text-white cursor-pointer font-medium mt-5 p-3 hover:bg-blue-700"
        onClick={handleCreateWorkSpaces}
      >
        {type === "edit" ? "Rename" : "Create"}
      </button>
    </div>
  );
};

export default AddEditeWorkSpaces;
