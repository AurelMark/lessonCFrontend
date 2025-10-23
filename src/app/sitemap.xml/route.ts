import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = "https://phonetics.md";
    const staticUrls = [
        "",
        "/courses",
        "/blog",
        "/contact",
        "/about-us",
        "/faq",
    ];

    const allUrls = staticUrls;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
            .map(
                (url) => `<url>
    <loc>${baseUrl}${url}</loc>
  </url>`
            )
            .join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
