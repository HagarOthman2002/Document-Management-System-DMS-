import EmptyCard from "../components/cards/EmptyCard";
import spamImg from "../assets/spam.svg";

function Spam({}) {
  return (
    <EmptyCard
      optionalGreet="Spam"
      className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]"
      imgSrc={spamImg}
      title="your spam is empty"
      message="files in spam won't appear any where else in Drive. files are permanently removed after 30 days."
    />
  );
}

export default Spam;
