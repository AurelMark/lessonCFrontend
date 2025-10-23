"use client";
import { useAuthLog } from "@/hooks/useAuthLog";

export function AuthLog() {
  useAuthLog();
  return null;
}
