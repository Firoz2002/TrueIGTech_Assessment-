"use client";

import moment from "moment";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ThumbsUp, MessageCircle, MoreHorizontal, Globe, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Post } from "@/types/post";
import { User } from "@/types/user";
import { Comment } from "@/types/comment";

interface Props {
  post: Post;
  user: User;
  likeButtonHandler: (postId: string, isLiked: boolean) => void;
  reportButtonHandler: (postId: string) => void;
  deletePostHandler: (postId: string) => void;
}

export default function PostCard({ post, user, likeButtonHandler, reportButtonHandler, deletePostHandler }: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [commentText, setCommentText] = useState("");

  const isOwner = post.userId === user.id;

  useEffect(() => {
    setIsLiked(post.likes?.some((like) => like.userId === user.id) || false);
    setLikeCount(post.likes?.length || 0);
  }, [post.likes, user.id]);

  const likeHandler = () => {
    likeButtonHandler(post.id, isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: crypto.randomUUID(),
      content: commentText,
      userId: user.id,
      postId: post.id,
      post: post,
      user: { ...user },
      createdAt: new Date(),
      updatedAt: new Date(),
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
      console.error("Failed to comment", err);
    }
  };

  return (
    <Card className="mb-5">
      <CardHeader className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.user.id}`} className="flex items-center gap-3">
            <img
              src={post.user.image || "/avatar.png"}
              alt={post.user.name || "user"}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{post.user.name} posted an update</p>
              <div className="flex items-center text-sm text-gray-500 gap-1">
                {moment(post.createdAt).fromNow()}
                <Globe size={14} />
              </div>
            </div>
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOwner && (
              <DropdownMenuItem onClick={() => deletePostHandler(post.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Post
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => reportButtonHandler(post.id)}>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pt-2">
        <p className="text-sm">{post.content}</p>
        {post.media?.length > 0 && (
          <img
            src={post.media[0]}
            alt="post"
            className="mt-4 w-full max-h-80 rounded object-contain"
          />
        )}
        {likeCount > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            {isLiked
              ? likeCount === 1
                ? "You like this"
                : `You and ${likeCount - 1} others like this`
              : `${likeCount} people like this`}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex gap-4">
        <Button variant="ghost" size="sm" onClick={likeHandler} className="flex items-center gap-1">
          <ThumbsUp className={`${isLiked ? "text-red-500" : "text-gray-500"}`} />
          {isLiked ? "Dislike" : "Like"}
        </Button>

        <Button variant="ghost" size="sm" onClick={() => setShowComments((prev) => !prev)} className="flex items-center gap-1">
          <MessageCircle className="text-red-500" />
          Comment
        </Button>
      </CardFooter>

      {showComments && (
        <CardContent className="pt-0">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" onClick={submitComment}>
              <Send className="text-red-500" />
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2 items-start">
                <img
                  src={comment.user.image || "/avatar.png"}
                  alt={comment.user.name || "user"}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex flex-col bg-gray-100 px-3 py-2 rounded-lg">
                  <p className="text-sm font-medium">{comment.user.name}</p>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}