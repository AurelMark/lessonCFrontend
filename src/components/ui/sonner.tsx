"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { useEffect, useState } from "react";

export const Toaster = (props: ToasterProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  const toastClassSuccess = isDark ? "!bg-emerald-950" : "!bg-emerald-50";
  const infoClassSuccess = isDark ? "!bg-gray-950" : "!bg-gray-50";
  const errorClassSuccess = isDark ? "!bg-red-950" : "!bg-red-50";

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          info: `${infoClassSuccess} shadow-lg border-none rounded-lg`,
          success: `${toastClassSuccess} shadow-lg border-none rounded-lg`,
          error: `${errorClassSuccess} shadow-lg border-none rounded-lg`,
        },
      }}
      {...props}
    />
  );
};
