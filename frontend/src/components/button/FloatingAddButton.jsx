import { useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditeWorkSpaces from "../../pages/home/AddWorkspace"; 

function FloatingAddButton({ getAllWorkSpaces, showToastMessage,userInfo }) {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  return (
    <>
    
      <button
        className="w-16 h-16 flex items-center justify-center cursor-pointer rounded-2xl bg-black hover:bg-blue-600 fixed right-10 bottom-10 z-50"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>


      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)" },
        }}
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
      >
        <AddEditeWorkSpaces
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          getAllWorkSpaces={getAllWorkSpaces}
          showToastMessage={showToastMessage}
          userInfo={userInfo}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
        />
      </Modal>
    </>
  );
}

export default FloatingAddButton;
