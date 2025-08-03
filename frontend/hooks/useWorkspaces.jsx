import { useState, useEffect } from "react";
import axiosInstance from "../src/utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../src/contexts/SearchContext";

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


  const { searchQuery, sort, order, type } = useSearch();

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
    try {
    
      let query = `?sort=${sort}&order=${order}`;
      if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;
      if (type) query += `&type=${encodeURIComponent(type)}`;

      const response = await axiosInstance.get(`/documents/${workspaceId}${query}`);
      setDocuments(response.data?.documents || []);
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
      const workspaceId = localStorage.getItem("currentWorkspaceId");
      if (workspaceId) {
        getAllDocuments(workspaceId); 
      }
    }
  }, [userInfo]);

  useEffect(() => {
    const workspaceId = localStorage.getItem("currentWorkspaceId");
    if (workspaceId) {
      getAllDocuments(workspaceId);
    }
  }, [searchQuery, sort, order, type]);

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
