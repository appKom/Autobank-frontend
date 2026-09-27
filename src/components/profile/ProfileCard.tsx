import React from 'react';
import profilePicture from '../../resources/profile/profile_pic.png';
import mailIcon from '../../icons/mail_icon.png';
import groupIcon from '../../icons/group_icon.png';
import { fetchUserComittees } from '../../api/baseAPI';
import { useQuery } from '@tanstack/react-query';

const ProfileCard = () => {
  const { data, isError } = useQuery({
    queryKey: ['committees'],
    queryFn: () => fetchUserComittees(),
  });

  return (
    <div className="w-64 bg-[#669782] text-white p-8 min-h-max rounded-xl ml-5">
      <div className="flex flex-col items-center">
        {/* Profile picture */}
        <img
          src={data?.imageUrl || profilePicture}
          alt={data?.name || 'Profilbilde'}
          className="w-full h-full rounded-full object-cover border-2 border-[#b0deca]"
        />

        {/* Name */}
        <h2 className="text-2xl mb-2 mt-5">{data && data.name}</h2>

        {/* Contact information */}
        <div className="my-3 flex items-start gap-2 min-w-0 w-full">
          <img src={mailIcon} alt="" className="size-5 shrink-0 mt-0.5" />
          <a
            href={`mailto:${data?.email}`}
            className="text-sm min-w-0 flex-1 truncate hover:underline"
            title={data?.email}
          >
            {data?.email}
          </a>
        </div>

        <div className="flow-root mb-2">
          <img src={groupIcon} alt="" className="float-left size-5 mr-2" />
          {data && data.committees.length
            ? data.committees.map((committee: any, index: number) => {
                const capitalizedName = committee.charAt(0).toUpperCase() + committee.slice(1);
                return (
                  <span key={index}>
                    {capitalizedName}
                    {index < data.committees.length - 1 && ', '}
                  </span>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
