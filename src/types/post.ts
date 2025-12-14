import { Like } from "./like";
import { User } from "./user";
import { Comment } from "./comment";

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
