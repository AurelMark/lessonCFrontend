"use client";

import { ActivateForm } from "@/components/Activate/ActivateForm";
import Footer from "@/custom/Footer";

export default function ActivatePage() {
  return (
    <>
      <div className="flex min-h-[calc(95vh-54px)] md:min-h-[calc(97vh-54px)] flex-col items-center justify-center bg-muted px-4">
        <div className="w-full max-w-sm md:max-w-3xl">
          <ActivateForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
