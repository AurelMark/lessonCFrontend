"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.replace("/ro/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role !== "admin") {
        router.replace("/ro/login");
        return;
      }

      setChecked(true);
    } catch {
      router.replace("/ro/login");
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="sticky inset-0 flex items-center justify-center bg-background z-50 h-screen">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
