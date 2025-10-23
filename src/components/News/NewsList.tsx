import { NewsList as NessListData, NewsEvent } from "@/validation/news";
import NewsListEvent from "./NewsListEvent";

type TNewsListProps = {
  data: NessListData;
};

export default function NewsList({ data }: TNewsListProps) {
  return (
    <div className="grid grid-cols-12 gap-y-4 gap-x-6">
      {data.map((nItem: NewsEvent, index: number) => (
        <NewsListEvent
          data={nItem}
          key={nItem.slug}
          priority={index === 0}
          classNames={
            index === 0
              ? "col-span-12"
              : index % 5 === 0
              ? "col-span-12 md:col-span-6 lg:col-span-6"
              : "col-span-12 sm:col-span-6 lg:col-span-4"
          }
        />
      ))}
    </div>
  );
}
