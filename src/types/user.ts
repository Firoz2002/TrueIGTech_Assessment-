import { Like } from "./like";
import { Post } from "./post";
import { Comment } from "./comment";
import { Follow } from "./follow";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  bio?: string | null;
  image?: string | null;
  password?: string | null;
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;

  likes?: Like[];
  posts?: Post[];
  comments?: Comment[];
  followers?: Follow[];
  following?: Follow[];
}
