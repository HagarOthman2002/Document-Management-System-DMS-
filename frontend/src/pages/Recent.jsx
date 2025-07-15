import { useState ,useEffect} from "react";
import EmptyCard from "./../components/cards/EmptyCard";
import recentsImg from "../assets/recent.svg"
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditeNotes from "../pages/home/AddWorkspace";
import ToastMessage from "../components/ToastMessage/ToastMessage";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axiosInstance from "./../utils/axiosInstance";



const Recent = ({getAllWorkSpaces,}) => {
   const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleEdite = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  //Get All notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("an unexpected error occured. please try again.");
    }
  };

  //Delete Note
  const deleteNote = async (data) => {
    const noteId = data?._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.message) {
        console.log("An unexpected error occurred. please try again");
      }
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);


  return (
    
    
    <>
      <div className="container mx-auto px-4">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={moment(item.createdOn).format("Do MMM YYYY")}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdite(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => {}}
              />
            ))}
          </div>
        ) : (
          <EmptyCard 
          optionalGreet="Recents"
  
          className = "flex flex-col justify-center items-center min-h-[calc(100vh-200px)]"
            imgSrc={recentsImg}
            title="A place for all of your files"
            message='Drag your files and folders here or use the "new" button to upload'
          />
        )}
      </div>

  

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
      >
        <AddEditeNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
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



export default Recent
