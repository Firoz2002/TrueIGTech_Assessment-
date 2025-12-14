import { User } from './user';
import { Post } from './post';

export interface Like {
  id: string;
  userId: string;
  user: User;
  postId: string;
  post: Post;
  createdAt: Date;
}