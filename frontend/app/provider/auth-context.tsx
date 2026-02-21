import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types";
import { queryClientConfig } from "./react-query-provider";
import { useLocation, useNavigate } from "react-router";
import { publicRoutes } from "@/lib";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Mặc định là true khi bắt đầu app

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const handleForceLogout = () => {
      console.warn("Phiên đăng nhập hết hạn!");
      logout(); // Gọi hàm logout xịn cậu đã viết bên dưới
    };

    // Lắng nghe sự kiện từ file fetch-utils.ts
    window.addEventListener("force-logout", handleForceLogout);

    return () => {
      window.removeEventListener("force-logout", handleForceLogout);
    };
  }, []);

  // Kiểm tra auth khi lần đầu load app
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userInfo = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userInfo && token) {
          setUser(JSON.parse(userInfo));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Nếu không phải route công khai thì đá về login
          if (!isPublicRoute) {
            navigate("/sign-in");
          }
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setIsLoading(false); // Luôn luôn tắt loading dù thành công hay thất bại
      }
    };

    checkAuth();
  }, [pathname, isPublicRoute]); // Thêm dependency để check lại khi chuyển trang

  const login = async (data: any) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Cập nhật state
    setUser(data.user);
    setIsAuthenticated(true);

    // Điều hướng sau khi login thành công
    navigate("/dashboard"); // Hoặc trang bạn muốn
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedWorkspaceId");
    setUser(null);
    setIsAuthenticated(false);
    queryClientConfig.clear();
    navigate("/sign-in");
  };
  const values = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const userAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
