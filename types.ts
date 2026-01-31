export enum AppTab {
  HOME = 'HOME',
  APPS = 'APPS',
  FEED = 'FEED',
  PROFILE = 'PROFILE'
}

export interface UserProfile {
  name: string;
  studentId: string;
  department: string;
  avatar: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface NewsItem {
  id: string;
  title: string;
  tag: string;
  tagColor: 'primary' | 'red';
  date: string;
  image: string;
  content: string; // Added for detail view
}

export interface PostItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
    bgColor: string;
    color: string;
  };
  time: string;
  content: string;
  image?: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked?: boolean; // Track if current user liked the post
}

export interface CommentItem {
  id: string;
  user: {
    name: string;
    avatar: string; // Using first char for simplicity in this demo
    bgColor: string;
  };
  content: string;
  time: string;
  likes: number;
  replies: CommentItem[]; // Nested replies (楼中楼)
  replyToUser?: string; // If this is a reply to a specific user inside the thread
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  time: string;
  type: 'system' | 'activity' | 'academic';
  isRead: boolean;
}