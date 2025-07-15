import AddEditeWorkSpaces from "../pages/home/AddWorkspace";
import { MdAdd } from "react-icons/md";
import { useState ,useEffect } from "react";
import Modal from "react-modal";
import ToastMessage from "../components/ToastMessage/ToastMessage";
import EmptyCard from "../components/cards/EmptyCard";
import myDriveImg from "../assets/myDrive.svg";
import WorkSpcaeCard from "../components/cards/WorkSpcaeCard";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import FloatingAddButton from "../components/button/FloatingAddButton";
import FileCard from "../components/cards/FileCard";


function MyDrive() {
  const {
    userInfo,
    allWorkSpaces,
    showToastMsg,
    getAllWorkSpaces,
    showToastMessage,
    handleCloseToast,
    deleteWorkspace,
    documents,             
  getAllDocuments,  
  } = useWorkspaces();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [documentsToShow, setDocumentsToShow] = useState([]);

  const handleRename = (workspaceData) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: workspaceData,
    });
  };

  useEffect(() => {
  const fetchSomeFiles = async () => {
    let collectedDocs = [];
    for (const workspace of allWorkSpaces) {
      const docs = await getAllDocuments(workspace._id);
      if (docs && docs.length > 0) {
        collectedDocs = [...collectedDocs, ...docs];
      }
      if (collectedDocs.length >= 6) break; // Show only 6 suggested files
    }
    setDocumentsToShow(collectedDocs);
  };

  if (allWorkSpaces.length > 0) {
    fetchSomeFiles();
  }
}, [allWorkSpaces]);


  return (
    <>
      <div className="container mx-auto px-4 ">
        {allWorkSpaces.length > 0 ? (
          <div className="grid grid-cols-5 gap-4 mt-8 ">
            {allWorkSpaces.map((item) => (
              <WorkSpcaeCard
                key={item._id}
                folderName={item.name}
                workspaceData={item}
                onRename={handleRename}
                onDelete={deleteWorkspace}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            optionalGreet="Welcome to drive"
            className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] "
            imgSrc={myDriveImg}
            message='Drag your files and folders here or use the "new" button to upload'
          />
        )}
      </div>
      {documentsToShow.length > 0 && (
  <>
   
    <div className="container mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 my-6">
      {documentsToShow.map((file) => (
        <FileCard key={file._id} file={file} />
      ))}
    </div>
  </>
)}


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

export default MyDrive;
