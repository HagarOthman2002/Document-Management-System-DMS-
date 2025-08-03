import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import WorkSpcaeCard from "../components/cards/WorkSpcaeCard";
import FileCard from "../components/cards/FileCard";
import EmptyCard from "../components/cards/EmptyCard";
import FloatingAddButton from "../components/button/FloatingAddButton";
import ToastMessage from "../components/ToastMessage/ToastMessage";
import AddEditeWorkSpaces from "../pages/home/AddWorkspace";
import Loader from "../components/Loader";
import {
  RiArrowLeftLine,
  RiArrowDropDownLine,
  RiArrowDropRightLine,
} from "react-icons/ri";


const getFileExtension = (filename) => {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.substring(lastDot).toLowerCase();
};

function DriveView({
  title = "My Drive",
  foldersHeader,
  filesHeader,
  emptyMessage = "You don't have any folders yet. Use the 'New' button to create one.",
  imgSrc,
  limitFolders = false,
  useDocumentsHook,
  useWorkspacesHook,
  useSearchHook,
  showLoader = false,
}) {
  const {
    userInfo,
    allWorkSpaces,
    getAllWorkSpaces,
    showToastMsg,
    showToastMessage,
    handleCloseToast,
    deleteWorkspace,
  } = useWorkspacesHook();

  const {
    searchQuery = "",
    sort = "createdAt",
    order = "desc",
    type = "",
  } = useSearchHook();

  const { documents, getAllDocuments, getAllDocumentsFromAllWorkspaces } =
    useDocumentsHook();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showFolders, setShowFolders] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const hasFetchedSuggestedDocs = useRef(false);
  const isInitialLoad = useRef(true);

  const hasActiveFilters = () => !!(type || searchQuery.trim());

  const getFilterSummary = () => {
    const activeFilters = [];
    if (type) {
      const typeLabel =
        type === "pdf"
          ? "PDF"
          : type === "image"
          ? "Images"
          : type === "docx"
          ? "Word Docs"
          : "Files";
      activeFilters.push(typeLabel);
    }
    if (searchQuery) activeFilters.push(`Search: "${searchQuery}"`);
    return activeFilters.length > 0
      ? `Filtered by: ${activeFilters.join(", ")}`
      : "";
  };


  const filteredDocuments = documents.filter((doc) => {

    if (type) {
      const ext = getFileExtension(doc.name);
      if (type === "pdf" && ext !== ".pdf") return false;
      if (type === "image" && ![".png", ".jpg", ".jpeg"].includes(ext))
        return false;
      if (type === "docx" && ![".docx", ".doc"].includes(ext)) return false;
    }


    if (
      searchQuery.trim() &&
      !doc.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    const savedId = localStorage.getItem("currentWorkspaceId");
    if (!savedId) return;
    const ws = allWorkSpaces.find((w) => w._id === savedId);
    if (ws) setSelectedWorkspace(ws);
  }, [allWorkSpaces]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (showLoader && isInitialLoad.current) {
        setLoadingDocs(true);
        isInitialLoad.current = false;
      }

      try {
        const filterParams = {
          searchQuery,
          sort,
          order,
          type,
        };

        if (selectedWorkspace) {
          await getAllDocuments(selectedWorkspace._id, filterParams);
        } else if (!hasFetchedSuggestedDocs.current && allWorkSpaces.length > 0) {
          hasFetchedSuggestedDocs.current = true;
          await getAllDocumentsFromAllWorkspaces(
            allWorkSpaces.map((ws) => ws._id),
            filterParams
          );
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        if (showLoader) setLoadingDocs(false);
      }
    };

    fetchFiles();
  }, [allWorkSpaces, selectedWorkspace, searchQuery, sort, order, type]);

  const handleOpenFolder = (workspace) => {
    setSelectedWorkspace(workspace);
    localStorage.setItem("currentWorkspaceId", workspace._id);
  };

  const handleClearSelection = () => {
    setSelectedWorkspace(null);
    localStorage.removeItem("currentWorkspaceId");
    hasFetchedSuggestedDocs.current = false;
    isInitialLoad.current = true;
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {selectedWorkspace ? (
          <>
            <button
              onClick={handleClearSelection}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-4"
            >
              <RiArrowLeftLine className="text-2xl" />
              Back to {title}
            </button>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-slate-800">
                {selectedWorkspace.name}
              </h2>
              {hasActiveFilters() && (
                <p className="text-sm text-blue-600 mt-1">{getFilterSummary()}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2
              onClick={() => setShowFolders(!showFolders)}
              className="text-2xl font-semibold text-slate-800 mb-4 flex items-center justify-center gap-2 hover:bg-slate-100 rounded-3xl w-70 cursor-pointer hover:text-blue-600"
            >
              {showFolders ? (
                <RiArrowDropDownLine className="text-4xl" />
              ) : (
                <RiArrowDropRightLine className="text-4xl" />
              )}
              {foldersHeader || title}
            </h2>

            {showFolders && (
              <>
                {allWorkSpaces.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(limitFolders ? allWorkSpaces.slice(0, 3) : allWorkSpaces).map(
                      (item) => (
                        <WorkSpcaeCard
                          key={item._id}
                          folderName={item.name}
                          workspaceData={item}
                          onRename={(data) =>
                            setOpenAddEditModal({
                              isShown: true,
                              type: "edit",
                              data,
                            })
                          }
                          onDelete={deleteWorkspace}
                          onOpen={handleOpenFolder}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <EmptyCard
                    className="flex flex-col justify-center items-center min-h-[200px]"
                    imgSrc={imgSrc}
                    message={emptyMessage}
                  />
                )}
              </>
            )}
          </>
        )}


        <div className="mb-10 mt-5">
          {!selectedWorkspace && (
            <div className="mb-4">
              <h2
                onClick={() => setShowFiles(!showFiles)}
                className="text-2xl font-semibold text-slate-800 mb-2 flex items-center justify-center gap-2 hover:bg-slate-100 rounded-3xl w-70 cursor-pointer hover:text-blue-600"
              >
                {showFiles ? (
                  <RiArrowDropDownLine className="text-4xl" />
                ) : (
                  <RiArrowDropRightLine className="text-4xl" />
                )}
                {filesHeader || "Files"}
              </h2>
              {hasActiveFilters() && (
                <p className="text-sm text-blue-600">{getFilterSummary()}</p>
              )}
            </div>
          )}

          {showFiles && (
            <>
              {showLoader && loadingDocs ? (
                <Loader />
              ) : filteredDocuments.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredDocuments.map((doc) => (
                    <FileCard key={doc._id} file={doc} />
                  ))}
                </div>
              ) : hasActiveFilters() ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-2">
                    No documents match your current filters.
                  </p>
                  <p className="text-sm text-slate-400">
                    Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <p className="text-slate-500 italic">No documents uploaded yet.</p>
              )}
            </>
          )}
        </div>
      </div>

      <FloatingAddButton
        userInfo={userInfo}
        getAllWorkSpaces={getAllWorkSpaces}
        showToastMessage={showToastMessage}
      />

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
      >
        <AddEditeWorkSpaces
          getAllDocuments={getAllDocuments}
          type={openAddEditModal.type}
          workspaceData={openAddEditModal.data}
          getAllWorkSpaces={getAllWorkSpaces}
          showToastMessage={showToastMessage}
          userInfo={userInfo}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
        />
      </Modal>

      <ToastMessage
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
}

export default DriveView;
