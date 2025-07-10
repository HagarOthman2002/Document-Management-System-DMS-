import React from "react";

import { getInitials } from "../../utils/helper";

const ProfileInfo = ({userInfo , onLogOut }) => {
  return (
    <div className=" items-center gap-3 hidden sm:flex ">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-white">
        {getInitials(userInfo?.fullName)}
      </div>

      <div>
        <p className="text-sm font-medium">{userInfo?.fullName}</p>
      <button onClick={onLogOut}><a className="text-sm text-blue-600 underline"  href="">Logout</a></button> 
      </div>
    </div>
  );
};

export default ProfileInfo;
