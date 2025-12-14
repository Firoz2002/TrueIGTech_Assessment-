import { User, Like, Comment } from "../../generated/prisma";

export interface Post {
  id: string;
  content: string;
  media: string[];

  userId: string;
  user: User;

  comments: Comment[];
  likes: Like[];

  createdAt: string;
  updatedAt: string;
}
