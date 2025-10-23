"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/custom/LocaleSwitcher";
import ThemeChanger from "@/custom/ChangeTheme";
import LoginComponent from "@/custom/Login";
import { HelpCircle, LayoutDashboard, MenuIcon, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/componentsUI/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/componentsUI/sheet";
import {
  HomeIcon,
  BookOpenIcon,
  NewspaperIcon,
  MailIcon,
  LayoutDashboardIcon,
  UserIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
  Settings2Icon,
} from "lucide-react";
import { useUserStore } from "@/store/useAuthStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { Separator } from "@/componentsUI/separator";

const menuItems = {
  public: [
    { href: "/", label: "menu.home", icon: HomeIcon },
    { href: "/courses", label: "menu.courses", icon: BookOpenIcon },
    { href: "/blog", label: "menu.blog", icon: NewspaperIcon },
    { href: "/contact", label: "menu.contact", icon: MailIcon },
    { href: "/faq", label: "menu.faq", icon: HelpCircle },
    { href: "/about-us", label: "homepage.aboutUs.aboutTitle", icon: Users },
  ],
  private: [
    { href: "/dashboard", label: "menu.dashboard", icon: LayoutDashboardIcon },
    { href: "/dashboard/profile", label: "menu.profile", icon: UserIcon },
    { href: "/dashboard/settings", label: "menu.settings", icon: SettingsIcon },
  ],
  admin: [
    { href: "/admin", label: "menu.adminHome", icon: ShieldIcon },
    { href: "/admin/users", label: "menu.users", icon: UsersIcon },
    {
      href: "/admin/settings",
      label: "menu.adminSettings",
      icon: Settings2Icon,
    },
  ],
} as const;

function getArea(pathname: string): "public" | "private" | "admin" {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/dashboard")) return "private";
  return "public";
}

export default function MainMenu() {
  const pathname = usePathname();
  const t = useTranslations();
  const area = getArea(pathname);
  const items = menuItems[area];
  const [open, setOpen] = useState(false);
  const useUserStoreState = useUserStore((state) => state.user);
  const isLogged = !!(
    useUserStoreState && Object.values(useUserStoreState).length > 0
  );

  return (
    <header className="border-b bg-slate-900 dark:bg-background shadow-sm sticky top-0 z-40">
      <nav className="hidden lg:flex items-center justify-between px-4 py-2 w-full">
        <div className="flex items-center gap-6">
          <div className="font-bold text-sm sm:text-base lg:text-lg leading-tight whitespace-nowrap text-white">
            <Link href='/'>Phonetics Learning Center</Link>
          </div>
          <ul className="flex gap-1 md:gap-4">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded transition flex items-center whitespace-nowrap text-white",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground font-semibold shadow "
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <>
                    <item.icon className="inline w-4 h-4 mr-2" />
                    {t(item.label)}
                  </>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <LoginComponent />
          {isLogged && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline">
                    <Link href="/dashboard">
                      <LayoutDashboard />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("menu.dashboard")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <div className="bg-white dark:bg-background rounded-lg">
            <LocaleSwitcher />
          </div>
          <ThemeChanger />
        </div>
      </nav>

      <nav className="flex lg:hidden items-center justify-between px-2 py-2 w-full">
        <div className="font-bold text-lg leading-tight text-white">
          <Link href='/'>Phonetics Learning Center</Link>
        </div>
        <div className="flex items-center gap-2 text-white">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Open menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0 z-[999999]">
              <SheetTitle className="sr-only">Main menu</SheetTitle>
              <SheetDescription className="sr-only">
                Main navigation drawer, use tab to navigate links.
              </SheetDescription>
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="flex items-center p-4 border-b">
                  <span className="font-bold text-lg mt-4">
                    Phonetics Learning Center
                  </span>
                </div>
                <div className="flex gap-4 justify-around my-4">
                  <LocaleSwitcher />
                  <ThemeChanger />
                </div>
                <nav className="flex flex-col gap-1 px-4 mt-4">
                  {items.map((item) => (
                    <Link
                      href={item.href}
                      key={item.href}
                      className={cn(
                        "px-2 py-2 rounded text-lg transition",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground font-semibold shadow"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="inline w-4 h-4 mr-2" />
                        {t(item.label)}
                      </div>
                    </Link>
                  ))}
                  {isLogged && (
                    <>
                      <Separator />
                      <Link
                        href={"/dashboard"}
                        className={cn(
                          "px-2 py-2 rounded text-lg transition hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="inline w-4 h-4 mr-2" />
                          {t("menu.dashboard")}
                        </div>
                      </Link>
                    </>
                  )}
                </nav>
                <div className="flex-1" />
                <div className="px-4 pb-4">
                  <LoginComponent />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
