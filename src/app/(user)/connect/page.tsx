"use client";
import { useEffect, useState } from 'react'
import Topbar from '@/components/layout/topbar';
import { User } from '@/types/user';

export default function ConnectPage() {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
    .then(res => res.json())
    .then(data => setUsers(data.data || []));
  }, []);

  const followHandler = (user_id: string) => {
    try {
      fetch(`/api/users/${user_id}/follow`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ following_id: user_id })
      })
      .then((res) => {
        if(res.status === 200) {
          setUsers(users.filter((user) => user.id !== user_id));
          console.log("Follow request successfull");
        } else {
          console.log("Follow request unsuccessfull");
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
        <Topbar currentPage={"friendsPage"}/>

        <div className="container mx-auto">
          <div className="flex flex-wrap m-4 justify-center">
            {(users.length) ? (
              <>
              {users.map((user: User) => (
                <div key={user.id} className="w-full h-60 max-w-70  p-2 bg-white border-2 rounded-xl m-2">
                  <div className="relative pb-28 overflow-hidden flex justify-center">
                    <img className="absolute h-25 w-25 rounded-full object-cover" src={( user.image ) ? user.image : "https://res.cloudinary.com/dhlsmeyw1/image/upload/v1729425848/CloudinaryDemo/ze0moba23397vhmmwgyp.png"} alt="user-profile-pic" />
                  </div>
                  <div className="text-center">
                    <h2 className="mb-2  font-bold text-xl"> { user.name } </h2>
                    <p className="text-sm text-[gray] text-ellipsis line-clamp-1"> { user?.bio || "" } </p>
                  </div>
                  <div className="h-14 p-1 border-t border-gray-300 flex items-center justify-end">
                    <button className="bg-[#f0793d] text-white p-1 rounded-md mr-1" onClick={() => followHandler(user.id)}>
                      + Follow
                    </button>
                  </div>
                </div>
              ))}
              </>
            ) : null}
          </div>
        </div>
    </>
  )
}
