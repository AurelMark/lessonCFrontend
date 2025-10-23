import { Skeleton } from "@/componentsUI/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function NewsListSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-y-4 gap-x-6">
      {Array.from({ length: 6 }).map((_, index) => {
        const classNames =
          index === 0
            ? "col-span-12"
            : index % 5 === 0
            ? "col-span-12 md:col-span-6 lg:col-span-6"
            : "col-span-12 sm:col-span-6 lg:col-span-4";

        return (
          <Card key={index} className={classNames}>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-[200px] rounded-md" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-9 w-24 rounded-full" />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
