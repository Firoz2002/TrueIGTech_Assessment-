import { Post } from './post';
import { User } from './user';

export interface Comment {
  id: string;
  content: string;
  userId: string;
  user: User;
  postId: string;
  post: Post;
  createdAt: Date;
  updatedAt: Date;
}