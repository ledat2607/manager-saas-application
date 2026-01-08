import { LanguageSwitch } from "./switch-language";
import { ModeToggle } from "./mode-toggle";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../ui/button";

const NavBarUser = () => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();

  // Glass effect triggers
  const background = useTransform(
    scrollY,
    [0, 40],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.15)"]
  );

  const border = useTransform(
    scrollY,
    [0, 40],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.2)"]
  );

  const blur = useTransform(scrollY, [0, 40], ["blur(0px)", "blur(18px)"]);

  return (
    <motion.div
      style={{
        background,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        borderBottom: border,
      }}
      className="
        sticky top-0 z-50
        w-full
      "
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img
              src="/logoTM.png"
              alt="Task Manager"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </Link>

          <span className="-ml-4 hidden gap-2 text-2xl font-bold lg:flex">
            Task
            <span className="bg-linear-to-r from-indigo-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
              Manager
            </span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to={"/sign-in"}>
            <Button variant="primary" className="cursor-pointer">
              {t("login")}
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitch />
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NavBarUser;
