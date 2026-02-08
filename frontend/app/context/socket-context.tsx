import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<any>(null);

export const SocketProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!userId) return; // Bảo vệ nếu userId chưa có

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("register-user", userId);

    newSocket.on("user-status-change", ({ userId: changedId, status }) => {
      setOnlineUsers((prev) => ({ ...prev, [changedId]: status }));
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  // --- THÊM HÀM NÀY VÀO ---
  const updateStatus = (status: string) => {
    if (socket && userId) {
      // Gửi sự kiện lên server
      socket.emit("update-manual-status", { userId, status });
    }
  };

  return (
    // Nhớ thêm updateStatus vào value của Provider
    <SocketContext.Provider value={{ socket, onlineUsers, updateStatus }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    return { socket: null, onlineUsers: {}, updateStatus: () => {} };
  return context;
};
