"use client";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Topbar from "@/components/layout/topbar";
import PostCard from "@/components/cards/post-card";
import UserCard from "@/components/cards/user-card";
import { User } from "@/types/user";
import { Follow } from "@/types/follow";

interface UserProfile extends User {
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

export default function Profile() {
  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const json = await res.json();

        if (json.success) {
          setUser(json.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleUnfollow = async (user_id: string) => {
    try {
      const res = await fetch(`/api/users/${user_id}/follow`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUser((prevState: UserProfile | null) => prevState ? { ...prevState, _count: { ...prevState._count, followers: prevState._count.followers - 1 }} : null);
      } else {
        throw new Error(`Failed to unfollow. Status code: ${res.status}`);
      }

    } catch (error) {
      console.error("Error while unfollowing:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok && user) {
        setUser({
          ...user,
          posts: user.posts?.filter((post) => post.id !== postId) || [],
        });
      } else {
        throw new Error(`Failed to delete post. Status code: ${res.status}`);
      }
    } catch (error) {
      console.error("Error while deleting post:", error);
    }
  };

  if (!user) return null;

  return (
    <>
      <Topbar currentPage="profilePage" />

      <div className="flex flex-col">
        <div className="h-[400px] w-full bg-[linear-gradient(to_top,white_0%,white_30%,#f0793d_30%,#f0793d_100%)]">
          <div className="flex items-center pt-24">
            <img
              className="ms-8 mt-5 h-[200px] w-[200px] rounded-md object-cover"
              src={
                user.image ||
                "https://res.cloudinary.com/dhlsmeyw1/image/upload/v1729425848/CloudinaryDemo/ze0moba23397vhmmwgyp.png"
              }
              alt="profile"
            />

            <div className="ms-5 text-white">
              <h1 className="text-4xl">{user.name}</h1>
            </div>
          </div>

          <div className="flex justify-between">
            <button className="ml-8 mt-3 rounded-md border-2 border-[#f0793d] px-12 py-2 text-[#f0793d]">
              EDIT PROFILE
            </button>

            <div className="flex px-20 text-xl text-black">
              <div className="mr-6 text-center">
                <h1>{user._count.posts}</h1>
                <p className="text-gray-500">Posts</p>
              </div>

              <div className="mr-6 text-center">
                <h1>{user._count.followers}</h1>
                <p className="text-gray-500">Followers</p>
              </div>

              <div className="text-center">
                <h1>{user._count.following}</h1>
                <p className="text-gray-500">Following</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10">
          <h1 className="mb-2 text-2xl">About</h1>
          <div className="min-h-40 rounded-lg border-2 bg-white p-4">
            <p className="text-lg text-gray-700">
              {user.bio || "No bio available"}
            </p>
            <p className="text-gray-500">
              Joined {moment(user.createdAt).fromNow()}
            </p>
          </div>
        </div>

        <div className="flex">
          <div className="pb-10 ps-10 xl:min-w-[630px]">
            <h1 className="mb-2 text-2xl">Recent Posts</h1>

            {user.posts?.length ? (
              user.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={user}
                  likeButtonHandler={(_postId: string, _isLiked: boolean) => {}}
                  reportButtonHandler={(_postId: string) => {}}
                  deletePostHandler={handleDeletePost}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No posts from this user
              </p>
            )}
          </div>

          <div className="m-8 flex w-full gap-6">
            <div className="max-h-80 w-80 overflow-y-scroll rounded-xl border-2 bg-white">
              <h1 className="p-5 text-2xl font-semibold">Following</h1>

              {user.following?.length ? (
                user.following.map((f: Follow) => (
                  <UserCard 
                    key={f.followee.id}  
                    image={f.followee.image || ""}
                    username={f.followee.name || ""}  
                    unfollow={() => handleUnfollow(f.followee.id)} 
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">Not following anyone</p>
              )}
            </div>

            <div className="max-h-80 w-80 overflow-y-scroll rounded-xl border-2 bg-white">
              <h1 className="p-5 text-2xl font-semibold">Followers</h1>

              {user.followers?.length ? (
                user.followers.map((f: Follow) => (
                  <UserCard 
                    key={f.follower.id} 
                    image={f.follower?.image || ""}
                    username={f.follower?.name || ""}
                    unfollow={() => handleUnfollow(f.follower.id)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">No followers yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
