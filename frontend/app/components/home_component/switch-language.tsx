"use client";

import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

export function LanguageSwitch() {
  const { i18n } = useTranslation();

  const isEnglish = i18n.language === "en";

  const handleToggle = (checked: boolean) => {
    const lang = checked ? "en" : "vi";
    i18n.changeLanguage(lang);

    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
    }
  };

  return (
    <div className="flex items-center">
      <span
        className={
          !isEnglish ? "font-semibold" : "text-muted-foreground hidden"
        }
      >
        <img
          src={"/vn.png"}
          alt="Vietnamese Flag"
          className="w-10 h-8 rounded-sm"
        />
      </span>

      <span
        className={isEnglish ? "font-semibold" : "text-muted-foreground hidden"}
      >
        <img
          src={"/us.png"}
          alt="Vietnamese Flag"
          className="w-10 h-8 rounded-sm"
        />
      </span>
      <Switch checked={isEnglish} onCheckedChange={handleToggle} />
    </div>
  );
}
