import EmptyCard from "./../components/cards/EmptyCard";
import recentsImg from "../assets/recent.svg";

const Recent = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        <EmptyCard
          optionalGreet="Recents"
          className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]"
          imgSrc={recentsImg}
          title="A place for all of your files"
          message='Drag your files and folders here or use the "new" button to upload'
        />
      </div>
    </>
  );
};

export default Recent;
