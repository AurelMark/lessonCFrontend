import Image from "next/image";
import { BadgeCentIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { LANG_TYPE } from "@/types";

type SubCourse = {
  courseSlug: string;
  description: { ro: string; en: string; ru: string };
  imageUrl: string;
  price: number | string;
  title: { ro: string; en: string; ru: string };
};

type Props = {
  subcourse: SubCourse;
};

export function SubCourseCard({ subcourse }: Props) {
  const locale = useLocale() as LANG_TYPE;
  return (
    <div className="group  rounded-xl shadow-xl overflow-hidden flex flex-col transition hover:shadow-2xl border border-solid">
      <div className="relative w-full h-44">
        <Image
          src={subcourse.imageUrl}
          alt={subcourse.title[locale]}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 25vw"
        />
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-lg">{subcourse.title[locale]}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {subcourse.description[locale]}
        </p>
        <div className="flex items-center gap-2 mt-auto pt-4">
          <span className="font-semibold text-xl">{subcourse.price} (MDL)</span>
          <BadgeCentIcon className="w-5 h-5 text-green-500" />
        </div>
      </div>
    </div>
  );
}
