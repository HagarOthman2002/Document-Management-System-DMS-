import { getInitials } from "../../utils/helper";
const ProfileInfo = ({ userInfo, onLogOut }) => {
  return (
    <div className=" items-center gap-3 hidden sm:flex ">
      <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-extrabold bg-gray-600 text-white">
        {getInitials(userInfo?.name)}
      </div>

      <div>
        <p className="text-sm font-medium ">{userInfo?.fullName}</p>
        <button onClick={onLogOut}>
          <a
            className="flex items-center justify-center rounded-full text-lg font-extrabold bg-gray-600 text-white px-4 py-2"
            href=""
          >
            Logout
          </a>
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
