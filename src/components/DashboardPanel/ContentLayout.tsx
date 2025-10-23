import { cn } from "@/lib/utils";
import { Navbar } from "./Navbar";
import { useTranslations } from "next-intl";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentLayout({
  title,
  children,
  className,
}: ContentLayoutProps) {
  const t = useTranslations();

  return (
    <div>
      <Navbar title={title} />
      <div className={cn("pt-8 pb-8 px-4 sm:px-8", className)}>{children}</div>
      <div className="bg-slate-900 text-white dark:bg-background py-3 text-center">
        {t("footer.createdWith")}
        <span className="text-red-500">❤</span>
        <br /> {t("footer.forCenter")} 2019 - {new Date().getFullYear()}
      </div>
    </div>
  );
}
