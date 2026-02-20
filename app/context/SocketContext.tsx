import { serverUrl } from "@/config/config";
import { SocketContextType, User } from "@/types/global.types";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<SocketContextType | undefined>(undefined);
export default SocketContext;

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoginned, setIsLoginned] = useState<boolean>(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const { userData } = useSelector((state: User) => state.user);

  useEffect(() => {
    if (userData?._id) {
      const socketIo = io(serverUrl, {
        transports: ["websocket"], // important for RN / Expo
        query: {
          userId: userData._id,
        },
      });

      setSocket(socketIo);

      socketIo.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socketIo.off("getOnlineUsers");
        socketIo.disconnect();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket?.disconnect();
        setSocket(null);
      }
    }
  }, [userData?._id]);

  const value: SocketContextType = {
    socket,
    onlineUsers,
    isLoginned,
    setIsLoginned,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
