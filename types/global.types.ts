import { Socket } from "socket.io-client";

export interface User {
  _id: string;
  userName: string;
  email: string;
  profileImage?: string;
  [prop: string]: any;
}

export interface Report {
  _id: string;
  reportingUser: User;
  reportedUser: User;
  reason: string;
  contentId: string;
  contentType: string;
  [prop: string]: any;
}

export interface Question {
  _id: string;
  user: User;
  question: string;
  media?: string;
  mediaType?: "image" | "video";
  [prop: string]: any;
}

export interface Answer {
  _id: string;
  user: User;
  question: Question;
  answer: string;
  media?: string;
  mediaType?: "image" | "video";
  [prop: string]: any;
}

export interface Message {
  _id: string;
  sender: User;
  message: string;
  [prop: string]: any;
}

export interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  isLoginned: boolean;
  setIsLoginned: (value: boolean) => void;
}
