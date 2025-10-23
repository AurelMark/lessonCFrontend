import { z } from 'zod';

export const NewsListEventSchema = z.object({
  title: z.object({
    ro: z.string(),
    en: z.string(),
    ru: z.string()
  }),
  description: z.object({
    ro: z.string(),
    en: z.string(),
    ru: z.string()
  }),
  tags: z.array(z.string()),
  content: z.object({
    ro: z.string(),
    en: z.string(),
    ru: z.string()
  }),
  imageUrl: z.string().optional(),
  slug: z.string().optional(),
  id: z.string().optional()
})
export const NewsListArraySchema = z.array(NewsListEventSchema);


export const NewsListParamsSchema = z.object({
  currentPage: z.number(),
  data: NewsListArraySchema,
  newsPerPage: z.number(),
  totalNews: z.number(),
  totalPages: z.number()
})

export const NewsDeleteByIdSchema = z.object({
  message: z.string()
})

const LocalizedStringSchema = z.object({
  ro: z
    .string()
    .min(1, {
      message: {
        ro: "Completați câmpul în română",
        ru: "Заполните поле на румынском языке",
        en: "Fill in the field in Romanian",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
  ru: z
    .string()
    .min(1, {
      message: {
        ro: "Completați câmpul în rusă",
        ru: "Заполните поле на русском языке",
        en: "Fill in the field in Russian",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
  en: z
    .string()
    .min(1, {
      message: {
        ro: "Completați câmpul în engleză",
        ru: "Заполните поле на английском языке",
        en: "Fill in the field in English",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
});

export const CreateNewsTagsSchema = z.object({
  tag: z.string().min(1, {
    message: {
      ro: "Eticheta nu poate fi goală",
      ru: "Тег не может быть пустым",
      en: "Tag cannot be empty",
    } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
  })
    .min(1, {
      message: {
        ro: "Adăugați cel puțin o etichetă",
        ru: "Добавьте хотя бы один тег",
        en: "Add at least one tag",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
});


export const CreateNewsSchema = z.object({
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  tags: z
    .array(
      z.string().min(1, {
        message: {
          ro: "Eticheta nu poate fi goală",
          ru: "Тег не может быть пустым",
          en: "Tag cannot be empty",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
      })
    )
    .min(1, {
      message: {
        ro: "Adăugați cel puțin o etichetă",
        ru: "Добавьте хотя бы один тег",
        en: "Add at least one tag",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
  content: z.object({
    ro: z.string().refine(
      (val) => val.replace(/<(.|\n)*?>/g, "").trim().length > 0,
      {
        message: {
          ro: "Introduceți conținutul în română",
          ru: "Введите контент на румынском языке",
          en: "Enter content in romanian",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
      }
    ),
    ru: z.string().refine(
      (val) => val.replace(/<(.|\n)*?>/g, "").trim().length > 0,
      {
        message: {
          ro: "Introduceți conținutul în rusă",
          ru: "Введите контент на русском языке",
          en: "Enter content in russian",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
      }
    ),
    en: z.string().refine(
      (val) => val.replace(/<(.|\n)*?>/g, "").trim().length > 0,
      {
        message: {
          ro: "Introduceți conținutul în engleză",
          ru: "Введите контент на английском языке",
          en: "Enter content in english",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
      }
    ),
  }),
  imageUrl: z
    .string()
    .optional(),
  slug: z
    .string()
    .optional(),
  id: z.string().optional()
});


export type NewsList = z.infer<typeof NewsListArraySchema>;
export type NewsEvent = z.infer<typeof NewsListEventSchema>;
export type NewsListParams = z.infer<typeof NewsListParamsSchema>;
export type NewsDeleteById = z.infer<typeof NewsDeleteByIdSchema>;
export type CreateNews = z.infer<typeof CreateNewsSchema>;
export type CreateNewsTags = z.infer<typeof CreateNewsTagsSchema>;
