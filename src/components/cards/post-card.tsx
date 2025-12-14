"use client";

import moment from "moment";
import { useEffect, useState } from "react";
import { MessageCircle, ThumbsUp, MoreHorizontal, Globe, Send } from "lucide-react";

import { Post } from "@/types/post";
import { User } from "../../../generated/prisma";

interface Props {
  post: Post;
  user: User;
  likeButtonHandler: (postId: string, isLiked: boolean) => void;
  reportButtonHandler: (postId: string) => void;
}

export default function PostCard({
  post,
  user,
  likeButtonHandler,
  reportButtonHandler,
}: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    setIsLiked(post.likes.some((like) => like.userId === user.id));
    setLikeCount(post.likes.length);
  }, [post.likes, user.id]);

  const likeHandler = () => {
    likeButtonHandler(post.id, isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: crypto.randomUUID(),
      content: commentText,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
      createdAt: new Date(),
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");

    try {
      await fetch(`/api/posts/${post.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.content }),
      });
    } catch (err) {
      console.error("Failed to comment");
    }
  };

  return (
    <div className="mb-5 rounded-xl border-2 border-[#eeedeb] bg-white p-4">
      {/* Header */}
      <div className="flex justify-between border-b-2 border-[#eeedeb] pb-2.5">
        <div className="flex items-center">
          <img
            className="mr-2.5 h-12 w-12 rounded-full object-cover"
            src={post.user.image || "/avatar.png"}
            alt="user-profile"
          />

          <div className="ml-1">
            <span className="text-lg font-medium text-black">
              {post.user.name}
            </span>{" "}
            posted an update
            <div className="flex items-center text-sm text-gray-500">
              {moment(post.createdAt).fromNow()}
              <Globe size={14} className="ml-1" />
            </div>
          </div>
        </div>

        <button onClick={() => reportButtonHandler(post.id)}>
          <MoreHorizontal size={24} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-lg">{post.content}</p>

        {post.media.length > 0 && (
          <img
            src={post.media[0]}
            alt="post"
            className="mt-4 max-h-80 w-full rounded object-contain"
          />
        )}
      </div>

      {likeCount > 0 && (
        <div className="px-5 text-sm text-gray-500">
          {isLiked
            ? likeCount === 1
              ? "You like this"
              : `You and ${likeCount - 1} others like this`
            : `${likeCount} people like this`}
        </div>
      )}

      <div className="mt-3 flex items-center px-5">
        <button onClick={likeHandler} className="mr-8 flex items-center">
          <ThumbsUp
            size={20}
            className={`mr-1 ${
              isLiked ? "text-[#FF4B2B]" : "text-gray-500"
            }`}
          />
          <span className="text-sm">{isLiked ? "Dislike" : "Like"}</span>
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center"
        >
          <MessageCircle size={20} className="mr-1 text-[#FF4B2B]" />
          <span className="text-sm">Comment</span>
        </button>
      </div>


      {showComments && (
        <div className="mt-4 border-t px-5 pt-4">
          <div className="mb-4 flex items-center gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none"
            />
            <button onClick={submitComment}>
              <Send size={18} className="text-[#FF4B2B]" />
            </button>
          </div>

          {comments.map((comment: any) => (
            <div key={comment.id} className="mb-3 flex gap-2">
              <img
                src={comment.user.image || "/avatar.png"}
                className="h-8 w-8 rounded-full"
              />
              <div className="rounded-lg bg-gray-100 px-3 py-2">
                <p className="text-sm font-medium">{comment.user.name}</p>
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-gray-500">
                  {moment(comment.createdAt).fromNow()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
