import { useEffect, useState } from 'react';
import { User } from '../../../generated/prisma';

export default function FollowingTab() {

    const [followingList, setFollowingList] = useState<User[]>([]);

    useEffect(() => {
      fetch('/api/users/following')
      .then(res => res.json())
      .then(data => setFollowingList(data.data || []));
    }, [])

  return (
    <div className="p-5 rounded-lg bg-white border-2  border-[#eeedeb] sticky overflow-y-scroll max-h-122.5 mb-6">
      <h1 className="font-semibold text-2xl">
        I'm Following
      </h1>
      <div className="flex justify-center flex-wrap m-2">
        <img className="w-12 h-12 object-cover mr-1 rounded-full m-2" src="/assets/2.webp" alt="" />
        {(followingList.length) ? 
          followingList.map((following) => (
            <img className="w-12 h-12 object-cover mr-1 rounded-full m-2" src={following.image || "/assets/2.webp"} key={following.id} alt="" />
          ))
          : null
        }
      </div>
    </div>
  )
}
