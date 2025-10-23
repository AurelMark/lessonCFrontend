import { SheetMenu } from "./SheetMenu";
import ThemeChanger from "@/custom/ChangeTheme";
import LocaleSwitcher from "@/custom/LocaleSwitcher";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background shadow backdrop-blur supports-[backdrop-filter]:bg-background dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <LocaleSwitcher />
          <ThemeChanger />
        </div>
      </div>
    </header>
  );
}