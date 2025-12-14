import {useState, useEffect} from 'react'
import { useSession } from "next-auth/react";

import Share from "./share";
import Navbar from './navbar';
import PostCard from '../cards/post-card';
import { Post } from '@/types/post';
import { User } from '../../../generated/prisma';

interface Props {
  user: User;
}

export default function Feed({ user }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/feed')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setPosts(data.data || [])
  });
  }, []);

  const createPostHandler = (newPost : Post) => {
    try {
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.log(error);
    }
  }

  const likeButtonHandler = (post_id : string, isLiked : boolean) => {
    try {
      fetch(`/api/posts/${post_id}/like`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          post_id : post_id,
          isLiked : isLiked,
        })
      })
      .then((res) => {
        if(res.status === 201) {
          console.log("Success");
        } else {
          console.error("Some error occured");
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  const reportButtonHandler = (post_id: string) => {
    try {
      fetch(`${process.env.REACT_APP_API_KEY}/api/v1/post/report`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          post_id : post_id,
        })
      })
      .then((res) => {
        if(res.status === 200) {
          alert("Post has been reported. Thanks for your contribution to this community.");
          setPosts(posts.filter((post) => post.id !== post_id));
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const deletePostHandler = (post_id: string) => {
    try {
      fetch(`/api/posts/${post_id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
      })
      .then((res) => {
        if(res.status === 200) {
          setPosts(posts.filter((post) => post.id !== post_id));
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex-6 h-full w-full mt-7.5 [@media(max-width:1200px)]:pl-5 [@media(max-width:1200px)]:pr-5 [@media(max-width:1200px)]:py-0">
      <h1 className='text-3xl font-bold ml-3'>Activity Feed</h1>
      <Share 
        user={user}
        createPostHandler={createPostHandler}
      />
      <Navbar/>
      
      <div className="postsContainer">
        {(posts.length) ? 
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post}
              user={user}
              likeButtonHandler={likeButtonHandler} 
              reportButtonHandler={reportButtonHandler}
              deletePostHandler={deletePostHandler}/>
          ))
          : null
        }
      </div>
    </div>   
  )
}
