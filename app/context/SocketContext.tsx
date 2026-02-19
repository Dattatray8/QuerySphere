import { serverUrl } from "@/config/config";
import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();
export default SocketContext;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isLoginned, setIsLoginned] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { userData } = useSelector((state) => state.user);

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

  const value = {
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
