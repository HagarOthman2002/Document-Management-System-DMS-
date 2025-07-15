import { useState, useEffect } from "react";
import axiosInstance from "../src/utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export function useWorkspaces() {
  const [userInfo, setUserInfo] = useState(null);
  const [allWorkSpaces, setAllWorkSpaces] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const navigate = useNavigate();

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "", type: "add" });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

const getAllWorkSpaces = async () => {
    try {
      const response = await axiosInstance.get(`/workspaces`);
      if (response.data?.workspaces) {
        setAllWorkSpaces(response.data.workspaces);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

 const getAllDocuments = async (workspaceId) => {
  if (!workspaceId) return;
  console.log("Calling API for documents for workspace:", workspaceId);
  try {
    const response = await axiosInstance.get(`/documents/${workspaceId}`);
    return response.data?.documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};



  const deleteWorkspace = async (workspace) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workspace.name}"?`
    );
    if (!confirmed) return;

    try {
      const response = await axiosInstance.delete(
        `/workspaces/${workspace._id}`
      );
      if (response.data?.status === "success") {
        showToastMessage("Workspace deleted successfully", "delete");
        await getAllWorkSpaces();
      } else {
        showToastMessage("Failed to delete workspace", "error");
      }
    } catch (error) {
      console.error("Delete workspace error:", error);
      showToastMessage("An error occurred while deleting", "error");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo?.nid) {
      getAllWorkSpaces();
      getAllDocuments(); // 🆕 fetch files after user is loaded
    }
  }, [userInfo]);

  return {
    userInfo,
    allWorkSpaces,
    documents, 
    showToastMsg,
    showToastMessage,
    handleCloseToast,
    deleteWorkspace,
    getAllWorkSpaces,
    getAllDocuments,
  };
}
