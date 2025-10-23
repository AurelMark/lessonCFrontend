import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intl = createMiddleware(routing);

const LOCALES = routing.locales;
const DEFAULT = routing.defaultLocale ?? "ru";

function getPathWithoutLocale(pathname: string) {
  const parts = pathname.split("/");
  if (parts.length > 2 && /^[a-z]{2}$/.test(parts[1])) {
    return "/" + parts.slice(2).join("/");
  }
  return pathname;
}

function parseJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const json = Buffer.from(payload, "base64").toString();
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  // 1) если путь без локали → редирект с локалью из cookie (или default)
  if (!hasLocale) {
    const loc =
      cookieLocale && LOCALES.includes(cookieLocale) ? cookieLocale : DEFAULT;

    const res = NextResponse.redirect(new URL(`/${loc}${pathname}`, request.url));

    // записываем куку обратно, чтобы зафиксировать язык
    res.cookies.set("NEXT_LOCALE", loc, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: true,
      maxAge: 30 * 24 * 60 * 60,
    });

    return res;
  }

  // 2) твоя логика для /dashboard
  if (pathname.includes("/dashboard")) {
    const token = request.cookies.get("token")?.value;
    const locale = pathname.split("/")[1];
    const loginPath = `/${locale}/login`;
    const learnPath = `/${locale}/dashboard`;

    if (!token) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    const user = parseJwt(token);
    const path = getPathWithoutLocale(pathname);

    if (!user || !user.role || user.isTempAccount || !user.isVerified) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    if (user.role === "client") {
      if (
        path === "/dashboard/" ||
        path.startsWith("/dashboard/learn") ||
        path.startsWith("/dashboard/profile")
      ) {
        // разрешаем
      } else {
        if (pathname !== learnPath) {
          return NextResponse.redirect(new URL(learnPath, request.url));
        }
      }
    } else if (user.role === "admin") {
      // админ → пускаем
    } else {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  // 3) intl middleware (поддержка локализации)
  const response = intl(request);

  // 🔑 если в URL есть локаль, но в cookie её нет — записываем
  if (!request.cookies.get("NEXT_LOCALE")) {
    const currentLocale = pathname.split("/")[1] || DEFAULT;
    response.cookies.set("NEXT_LOCALE", currentLocale, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: true,
      maxAge: 30 * 24 * 60 * 60,
    });
  }

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
