import { User } from './user';

export interface Follow {
  id: string;
  followerId: string;
  follower: User;
  followeeId: string;
  followee: User;
  createdAt: Date;
}