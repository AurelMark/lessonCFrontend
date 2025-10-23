"use client";

import { useUserStore } from "@/store/useAuthStore";
import {
  BookOpen,
  Contact,
  User,
  Users,
  FileText,
  Home,
  Newspaper,
  GraduationCap,
  UserIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { useTranslations } from "next-intl";

const typeTiles = {
  admin: [
    { href: "/", label: "homepage", icon: Home },
    { href: "/dashboard/contact", label: "contact", icon: Contact },
    { href: "/dashboard/course", label: "course", icon: GraduationCap },
    { href: "/dashboard/exams", label: "exams", icon: FileText },
    { href: "/dashboard/faq", label: "faq", icon: BookOpen },
    { href: "/dashboard/groups", label: "groups", icon: Users },
    { href: "/dashboard/history", label: "history", icon: FileText },
    { href: "/dashboard/lesson", label: "lesson", icon: BookOpen },
    { href: "/dashboard/news", label: "news", icon: Newspaper },
    { href: "/dashboard/users", label: "users", icon: Users },
    { href: "/dashboard/profile", label: "profile", icon: User },
    { href: "/dashboard/about-us", label: "aboutUs", icon: User },
  ],
  client: [
    { href: "/", label: "homepage", icon: Home },
    { href: "/dashboard/learn/exams", label: "exams", icon: FileText },
    { href: "/dashboard/learn/lesson", label: "lesson", icon: BookOpen },
    { href: "/dashboard/profile", label: "profile", icon: User },
  ],
};

const DashboardWelcome = () => {
  const user = useUserStore((state) => state.user);
  const [showTiles, setShowTiles] = useState(false);
  const t = useTranslations();
  const tiles = typeTiles[(user?.role as keyof typeof typeTiles) ?? "client"];

  useEffect(() => {
    const timer = setTimeout(() => setShowTiles(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-9rem)] w-full p-8 animate-fade-in bg-background rounded-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold mb-2 tracking-wide">
          {t("dashboard.Twelcome")}
        </h1>
        <h2 className="text-2xl text-muted-foreground flex items-center justify-center gap-2">
          <Link href="/dashboard/profile">
            {`${user?.firstName} ${user?.lastName}`}
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/profile">
                  <UserIcon className="w-5 h-5 opacity-70 hover:opacity-100 transition" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                {t("dashboard.profileTooltip")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h2>
      </div>

      {showTiles && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center max-w-5xl w-full transition-opacity duration-700 animate-fade-in">
          {tiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="rounded-xl p-4 h-28 flex flex-col justify-between border border-transparent dark:bg-white/5 bg-secondary dark:hover:bg-white/10 hover:bg-secondary/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-lg dark:hover:border-white/20 hover:border-secondary"
            >
              <tile.icon className="w-6 h-6 opacity-70" />
              <span className="text-base font-medium">
                {t(`dashboard.welcomeMenu.${tile.label}`)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardWelcome;
