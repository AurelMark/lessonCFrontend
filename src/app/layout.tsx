// app/layout.tsx
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = await cookieStore.get("theme");
  const locale = (await cookieStore.get("NEXT_LOCALE")?.value) || "ru";
  const theme = themeCookie?.value ?? "light";

  return (
    <html
      lang={locale}
      data-theme={theme}
      style={{ colorScheme: theme }}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
