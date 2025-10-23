import { ReactNode } from "react";
import MainMenu from "@/custom/MainMenu";
import { AuthLog } from "@/custom/Auth";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthLog />
      <MainMenu />
      <div className="flex flex-col">
        <main className="flex-1 p-4">{children}</main>
      </div>
    </>
  );
}
