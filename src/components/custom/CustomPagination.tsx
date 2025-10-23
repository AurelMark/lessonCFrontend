"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// max page buttons: 8 for desktop, 5 for mobile
const MAX_PAGE_BUTTONS_DESKTOP = 8;
const MAX_PAGE_BUTTONS_MOBILE = 5;

type NewsPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function getPageNumbers(current: number, total: number, maxButtons: number) {
  // 2 for first/last, 2 for '...', so real numbers: maxButtons - 2 or -4
  if (total <= maxButtons) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | string)[] = [];
  const midButtons = maxButtons - 2; // always show first & last
  let left = Math.max(2, current - Math.floor((midButtons - 1) / 2));
  let right = Math.min(total - 1, current + Math.floor((midButtons - 1) / 2));

  if (left <= 2) {
    left = 2;
    right = left + midButtons - 1;
  } else if (right >= total - 1) {
    right = total - 1;
    left = right - midButtons + 1;
  }

  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) {
    pages.push(i);
  }
  if (right < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: NewsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const maxButtons = isMobile ? MAX_PAGE_BUTTONS_MOBILE : MAX_PAGE_BUTTONS_DESKTOP;
  const pageNumbers = getPageNumbers(currentPage, totalPages, maxButtons);

  const updateUrlAndState = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    router.push(`${pathname}?${params.toString()}`);
    onPageChange(page);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) updateUrlAndState(currentPage - 1);
            }}
          />
        </PaginationItem>

        {pageNumbers.map((page, idx) => (
          <PaginationItem key={idx}>
            {page === "..." ? (
              <span className="px-2 text-muted-foreground select-none">...</span>
            ) : (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof page === "number" && page !== currentPage)
                    updateUrlAndState(page);
                }}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) updateUrlAndState(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
