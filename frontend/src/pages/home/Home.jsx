import DriveView from "../../components/DriveView";
import { useDocuments } from "../../contexts/DocumentsContext";
import { useWorkspaces } from "../../../hooks/useWorkspaces";
import { useSearch } from "../../contexts/SearchContext";
import HomeImg from "../../assets/home.svg";

function Home() {
  return (
    <DriveView
      title="Suggested Folders"
      emptyMessage="You don't have any folders yet. Use the 'New' button to create one."
      imgSrc={HomeImg}
      limitFolders={true}
      useDocumentsHook={useDocuments}
      useWorkspacesHook={useWorkspaces}
      useSearchHook={useSearch}
      showLoader={false}
    />
  );
}

export default Home;
