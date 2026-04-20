import { LanguageSwitch } from "./switch-language";
import { ModeToggle } from "./mode-toggle";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../ui/button";
import type { User } from "@/types";
import { userAuth } from "@/provider/auth-context";
import UserMenu from "./user-menu";

interface NavBarUserProps {
  user?: User | null;
}

const NavBarUser = ({ user }: NavBarUserProps) => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();

  // Biến đổi độ rộng và bo góc khi cuộn
  const maxWidth = useTransform(scrollY, [0, 50], ["100%", "95%"]);
  const marginTop = useTransform(scrollY, [0, 50], ["0px", "12px"]);
  const borderRadius = useTransform(scrollY, [0, 50], ["0px", "20px"]);
  const borderOpacity = useTransform(scrollY, [0, 50], ["0", "0.2"]);

  // Hiệu ứng Glassmorphism đậm dần
  const background = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.08)"],
  );
  const blur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);

  return (
    <div className="sticky top-0 z-50 flex justify-center w-full pointer-events-none">
      <motion.nav
        style={{
          background,
          backdropFilter: blur,
          WebkitBackdropFilter: blur,
          width: maxWidth,
          marginTop,
          borderRadius,
        }}
        className="pointer-events-auto border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-shadow duration-300"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2.5">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="group flex items-center gap-3 transition-transform active:scale-95"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src="/logoTM.png"
                alt="Logo"
                className="relative h-10 w-auto object-contain drop-shadow-md"
              />
            </div>
            <span className="hidden text-xl font-extrabold tracking-tight lg:block">
              Task{" "}
              <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Manager
              </span>
            </span>
          </Link>

          {/* Actions & Tools */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1 px-3 py-2 rounded-2xl bg-slate-900/10 border border-white/5">
              <LanguageSwitch />
              <div className="w-px h-4 bg-white/10 mx-1" />
              <ModeToggle />
            </div>

            <div className="flex items-center">
              {user ? (
                <div className="pl-4 border-l border-white/10">
                  <UserMenu user={user} />
                </div>
              ) : (
                <Button
                  asChild
                  variant="primary"
                  className="rounded-full shadow-lg shadow-blue-500/20"
                >
                  <Link to="/sign-in">{t("login")}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default NavBarUser;
