import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import EmptyCard from "../components/cards/EmptyCard";
import TrashImg from "../assets/trash.svg";
import FileCard from "../components/cards/FileCard";
import { useSearch } from "../contexts/SearchContext";

function Trash() {
  const [trashDocs, setTrashDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch();

  const removeFromList = useCallback((id) => {
    console.log("Removing from list:", id);
    setTrashDocs((prev) => prev.filter((d) => d._id !== id));
  }, []);

  const fetchTrashDocs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/documents/trash", {
        params: searchQuery ? { search: searchQuery } : {},
      });
      console.log("Delete response:", response);
      if (response.data?.documents) {
        setTrashDocs(response.data.documents);
      } else {
        setTrashDocs([]);
      }
    } catch (error) {
      console.error("Failed to fetch trash documents:", error);
      setTrashDocs([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleRestored = useCallback(
    async (id) => {
      try {
        await axiosInstance.patch(`/documents/${id}/restore`);
        removeFromList(id);
      } catch (error) {
        console.error("Failed to restore document:", error);
      }
    },
    [removeFromList]
  );

  const handleDeletedForever = useCallback(
  async (id) => {
    try {
      const response = await axiosInstance.delete(`/documents/${id}/permanent`);
      console.log('Delete response:', response);
      removeFromList(id); 
    } catch (error) {
      console.error("Failed to permanently delete document:", error);
      if (error?.response?.status === 404) {
        console.warn("Document not found on server, removing from UI anyway.");
        removeFromList(id); 
      }
    }
  },
  [removeFromList]
);




  useEffect(() => {
    fetchTrashDocs();
  }, [fetchTrashDocs]);

  if (loading) {
    return <p className="text-center mt-10">Loading trash...</p>;
  }

  if (!trashDocs.length) {
    return (
      <EmptyCard
        optionalGreet="Trash"
        className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]"
        imgSrc={TrashImg}
        title="Trash is empty"
        message="Items moved to the trash will be deleted forever after 30 days."
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">
        Trash Files
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {trashDocs.map((doc) => (
          <FileCard
            key={doc._id}
            file={doc}
            isTrashView
            onRestored={handleRestored}
            onDeletedForever={handleDeletedForever}
          />
        ))}
      </div>
    </div>
  );
}

export default Trash;
