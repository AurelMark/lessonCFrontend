import { Loader2 } from "lucide-react";

export function ContentLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
      <Loader2 className="w-16 h-16 text-primary animate-spin" />
    </div>
  );
}
