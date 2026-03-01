import React from "react";
import profilePicture from "../../resources/profile/profile_pic.png";
import mailIcon from "../../icons/mail_icon.png";
import groupIcon from "../../icons/group_icon.png";
import { fetchCommittees, fetchUserComittees } from "../../api/baseAPI";
import { useQuery } from "@tanstack/react-query";

const ProfileCard = () => {


  const { data , isError } = useQuery({
    queryKey: ["committees"],
    queryFn: () => fetchUserComittees(),
  });

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="w-64 bg-[#669782] text-white p-8 min-h-max rounded-xl ml-5">
      <div className="flex flex-col items-center">
        <img src={profilePicture} alt="" />
        <h2 className="text-2xl mb-2 mt-5">{data && data.name}</h2>
        <div className="flow-root my-3">
          <img src={mailIcon} alt="" className="float-left size-5 mr-2"/>
          <p className="text-sm float-right">{data && data.email}</p>
        </div>
        <div className="flow-root mb-2">
          <img src={groupIcon} alt="" className="float-left size-5 mr-2"/>
          {data && data.committees.length ? data.committees.map((committee: any, index: number) => {
              const capitalizedName = committee.charAt(0).toUpperCase() + committee.slice(1);
              return (
                  <span key={index}>
                      {capitalizedName}{index < data.committees.length - 1 && ", "}
                  </span>
              );
          }) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
