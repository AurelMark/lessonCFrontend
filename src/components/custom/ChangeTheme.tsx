"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/componentsUI/button";
import { Moon, Sun } from "lucide-react";
import useSound from "use-sound";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";

export default function ThemeChanger() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  const [playLight] = useSound("/sounds/light.mp3", { volume: 0.5 });
  const [playDark] = useSound("/sounds/dark.mp3", { volume: 0.5 });

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleClick = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
      playLight();
    } else {
      setTheme("dark");
      playDark();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            className={cn("transition-transform duration-300 hover:scale-105")}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4 text-yellow-400" />
            ) : (
              <Moon className="size-4 text-gray-600" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t(resolvedTheme === "dark" ? "theme_light" : "theme_dark")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
