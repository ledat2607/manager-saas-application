import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome",
        login: "Login",
        logout: " Logout",
        dashboard: " Dashboard",
        profile: " Profile",
        settings: " Settings",
        slogan: "Manage your work with",
        description:
          " A modern project management platform with clarity, speed, and collaboration at its core.",
        homeBtn: "Get Started",
        learnBtn: "Learn More",

        whyReason:
          "Everything you need to plan, track, and complete your work — without complexity.",
        how: "Simple steps to boost your productivity",
        features: {
          organized: {
            title: "Stay Organized",
            desc: "Manage all your tasks in one place with clear priorities and status.",
          },
          time: {
            title: "Save Time",
            desc: "Focus on what matters most and reduce time spent tracking work.",
          },
          progress: {
            title: "Track Progress",
            desc: "Visualize your productivity with real-time insights and charts.",
          },
          simple: {
            title: "Simple & Beautiful",
            desc: "Clean interface with smooth interactions, designed to feel effortless.",
          },
          createTask: {
            title: "Create Tasks",
            des: "Add tasks in seconds with clear priorities and deadlines.",
          },
          focus: {
            title: "Organize & Focus",
            des: "Group tasks by status to stay focused and in control.",
          },
          tracking: {
            title: "Track Progress",
            des: "Visualize productivity with real-time insights.",
          },
          finish: {
            title: "Get Things Done",
            des: "Finish work with clarity and confidence every day.",
          },
        },
      },
    },

    vi: {
      translation: {
        welcome: "Chào mừng",
        login: "Đăng nhập",
        logout: " Đăng xuất",
        dashboard: " Quản lý",
        profile: " Thông tin cá nhân",
        settings: " Cài đặt",
        slogan: "Quản lý công việc của bạn với",
        description:
          " Một nền tảng quản lý dự án hiện đại với sự rõ ràng, tốc độ và hợp tác là cốt lõi.",
        homeBtn: "Bắt đầu",
        learnBtn: "Tìm hiểu thêm",
        whyReason:
          "Mọi thứ bạn cần để lập kế hoạch, theo dõi và hoàn thành công việc — không phức tạp.",
        how: "Những bước đơn giản giúp tăng năng suất của bạn",
        features: {
          organized: {
            title: "Quản lý khoa học",
            desc: "Tập trung tất cả công việc vào một nơi với trạng thái và ưu tiên rõ ràng.",
          },
          time: {
            title: "Tiết kiệm thời gian",
            desc: "Tập trung vào việc quan trọng nhất và giảm thời gian theo dõi thủ công.",
          },
          progress: {
            title: "Theo dõi tiến độ",
            desc: "Trực quan hóa năng suất với biểu đồ và số liệu thời gian thực.",
          },
          simple: {
            title: "Đơn giản & tinh tế",
            desc: "Giao diện gọn gàng, chuyển động mượt, dễ sử dụng.",
          },
          createTask: {
            title: "Tạo mới công việc",
            des: "Tạo công việc chỉ trong vài giây với mức độ ưu tiên và thời hạn rõ ràng.",
          },
          focus: {
            title: "Sắp xếp & Tập trung",
            des: "Nhóm công việc theo trạng thái để luôn tập trung và kiểm soát tốt hơn.",
          },
          tracking: {
            title: "Theo dõi tiến độ",
            des: "Trực quan hóa năng suất với các số liệu cập nhật theo thời gian thực.",
          },
          finish: {
            title: "Hoàn thành công việc",
            des: "Hoàn thành công việc mỗi ngày với sự rõ ràng và tự tin.",
          },
        },
      },
    },
  },
  lng: "vi",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;

  i18n.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
  });
}

export default i18n;
