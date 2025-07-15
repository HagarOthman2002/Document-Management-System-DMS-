import AddEditeWorkSpaces from "../home/AddWorkspace";
import { MdAdd } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import EmptyCard from "../../components/cards/EmptyCard";
import HomeImg from "../../assets/home.svg";
import WorkSpcaeCard from "../../components/cards/WorkSpcaeCard";
import { RiArrowDropDownLine, RiArrowDropRightLine } from "react-icons/ri";
import { useWorkspaces } from "../../../hooks/useWorkspaces";
import FloatingAddButton from "../../components/button/FloatingAddButton";
import FileCard from "../../components/cards/FileCard";

function Home() {
  const {
    userInfo,
    allWorkSpaces,
    showToastMsg,
    getAllDocuments,
    getAllWorkSpaces,
    showToastMessage,
    handleCloseToast,
    deleteWorkspace,
  } = useWorkspaces();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showFolders, setShowFolders] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const [documents, setDocuments] = useState([]); 
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const hasFetchedSuggestedDocs = useRef(false);

  const handleRename = (workspaceData) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: workspaceData,
    });
  };

  const hasFetchedDocuments = useRef(false);
  //  Fetch documents from the first workspace

  // Fetch suggested files from multiple workspaces, only if no folder is selected
  useEffect(() => {
    const fetchSuggestedFiles = async () => {
      if (
        !hasFetchedSuggestedDocs.current &&
        allWorkSpaces.length > 0 &&
        !selectedWorkspace
      ) {
        hasFetchedSuggestedDocs.current = true;
        let collectedDocs = [];

        for (const workspace of allWorkSpaces) {
          const docs = await getAllDocuments(workspace._id);
          if (docs && docs.length > 0) {
            collectedDocs = [...collectedDocs, ...docs];
          }
          if (collectedDocs.length >= 6) break;
        }

        setDocuments(collectedDocs);
      }
    };

    fetchSuggestedFiles();
  }, [allWorkSpaces, selectedWorkspace]);

  // When folder is opened, fetch that folder's documents
  const handleOpenFolder = async (workspace) => {
    setSelectedWorkspace(workspace);
    localStorage.setItem("currentWorkspaceId", workspace._id); 
    const docs = await getAllDocuments(workspace._id);
    setDocuments(docs || []);
  };

  const handleClearSelection = () => {
  setSelectedWorkspace(null);
  localStorage.removeItem("currentWorkspaceId");
  hasFetchedSuggestedDocs.current = false;
};


  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-10">
          <h2
            onClick={() => setShowFolders(!showFolders)}
            className="text-2xl font-semibold text-slate-800 mb-4 flex items-center justify-center gap-2 hover:bg-slate-100 rounded-3xl w-70 cursor-pointer hover:text-blue-600"
          >
            {showFolders ? (
              <RiArrowDropDownLine className="text-4xl" />
            ) : (
              <RiArrowDropRightLine className="text-4xl" />
            )}
            Suggested Folders
          </h2>

          {showFolders &&
            (allWorkSpaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allWorkSpaces.slice(0, 3).map((item) => (
                  <WorkSpcaeCard
                    key={item._id}
                    folderName={item.name}
                    workspaceData={item}
                    onRename={handleRename}
                    onDelete={deleteWorkspace}
                    onOpen={handleOpenFolder}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                className="flex flex-col justify-center items-center min-h-[200px]"
                imgSrc={HomeImg}
                message='You don’t have any folders yet. Use the "New" button to create one.'
              />
            ))}
        </div>

        <div className="mb-10">
          <h2
            onClick={() => setShowFiles(!showFiles)}
            className="text-2xl font-semibold text-slate-800 mb-4 flex items-center justify-center gap-2 hover:bg-slate-100 rounded-3xl w-60 cursor-pointer hover:text-blue-600"
          >
            {showFiles ? (
              <RiArrowDropDownLine className="text-4xl" />
            ) : (
              <RiArrowDropRightLine className="text-4xl" />
            )}
            Suggested Files
          </h2>

          {showFiles &&
            (documents.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {documents.map((doc) => (
                  <FileCard key={doc._id} file={doc} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">
                No documents uploaded yet.
              </p>
            ))}
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
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
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

export default Home;
