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


  // Glass effect (giữ nguyên của bạn)
  const background = useTransform(
    scrollY,
    [0, 40],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.15)"],
  );
  const blur = useTransform(scrollY, [0, 40], ["blur(0px)", "blur(18px)"]);


  return (
    <motion.div
      style={{ background, backdropFilter: blur, WebkitBackdropFilter: blur }}
      className="sticky top-0 z-50 w-full border-b border-transparent transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img
              src="/logoTM.png"
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <span className="hidden text-xl font-bold lg:block">
            Task <span className="text-blue-500">Manager</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <ModeToggle />
          </div>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild variant="primary">
              <Link to="/sign-in">{t("login")}</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NavBarUser;
