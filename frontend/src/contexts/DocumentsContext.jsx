import { createContext, useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const DocumentsContext = createContext();

export const DocumentsProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);

  const getAllDocuments = async (
    workspaceId,
    search = "",
    sort = "createdAt",
    order = "desc",
    type = "",
    startDate = "",
    endDate = "",
    tags = []
  ) => {
    if (!workspaceId) return [];
    try {
      const params = {
        search,
        sort,
        order,
        type,
      };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (tags && tags.length > 0) {
        params.tags = tags.join(",");
      }

      const response = await axiosInstance.get(`/documents/${workspaceId}`, {
        params,
      });
      const docs = response.data.documents || [];
      setDocuments(docs);
      return docs;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  };

  const getAllDocumentsFromAllWorkspaces = async (
    workspaceIds,
    search = "",
    sort = "createdAt",
    order = "desc",
    type = "",
    startDate = "",
    endDate = "",
    tags = []
  ) => {
    try {
      let allDocs = [];
      for (const id of workspaceIds) {
        const params = {
          search,
          sort,
          order,
          type,
        };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (tags && tags.length > 0) {
          params.tags = tags.join(",");
        }

        const response = await axiosInstance.get(`/documents/${id}`, {
          params,
        });
        const docs = response.data.documents || [];
        if (docs.length) allDocs = [...allDocs, ...docs];
      }
      setDocuments(allDocs);
      return allDocs;
    } catch (error) {
      console.error("Error fetching all workspace documents:", error);
      return [];
    }
  };

  return (
    <DocumentsContext.Provider
      value={{ documents, getAllDocuments, getAllDocumentsFromAllWorkspaces }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

export const useDocuments = () => useContext(DocumentsContext);
