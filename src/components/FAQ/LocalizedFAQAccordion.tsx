"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQArray } from "@/validation/faq";
import { LANG_TYPE } from "@/types";
import { useLocale } from "next-intl";

type Props = {
  items: FAQArray;
};

export default function LocalizedFAQAccordion({ items }: Props) {
  const locale = useLocale() as LANG_TYPE;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={items[0] ? `item-${0}` : undefined}
    >
      {items.map((item, index) => (
        <AccordionItem key={`item-${index}`} value={`item-${index}`}>
          <AccordionTrigger className="text-lg">
            {item.question[locale]}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance text-muted-foreground text-sm leading-relaxed">
            <div
              className="prose prose-neutral dark:prose-invert !max-w-none w-full text-black dark:text-white prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800"
              dangerouslySetInnerHTML={{ __html: item.answer[locale] }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
