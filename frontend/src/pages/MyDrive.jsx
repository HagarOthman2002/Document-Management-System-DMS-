import DriveView from "../components/DriveView";
import { useDocuments } from "../contexts/DocumentsContext";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import { useSearch } from "../contexts/SearchContext";
import myDriveImg from "../assets/myDrive.svg";

function MyDrive() {
  return (
    <DriveView
      title="Folders"
      emptyMessage="You don't have any folders yet. Use the 'New' button to create one."
      imgSrc={myDriveImg}
      limitFolders={false}
      useDocumentsHook={useDocuments}
      useWorkspacesHook={useWorkspaces}
      useSearchHook={useSearch}
      showLoader={true}
    />
  );
}

export default MyDrive;
