import { z } from 'zod';

export const ExamsSchema = z.object({
    id: z.string().optional(),
    title: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    description: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    content: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    imageUrl: z.string(),
    slug: z.string(),
    createdBy: z.object({ firstName: z.string(), lastName: z.string(), role: z.string(), email: z.string() }),
    responsible: z.array(z.object({
        id: z.string().optional(),
        firstName: z.string(),
        lastName: z.string(),
        role: z.string(),
        email: z.string()
    })),
    lessons: z.array(z.object({
        id: z.string().optional(),
        title: z.object({
            ro: z.string(),
            ru: z.string(),
            en: z.string()
        }),
        imageUrl: z.string(),
        description: z.object({
            ro: z.string(),
            ru: z.string(),
            en: z.string()
        }),
        slug: z.string()
    })).nullable(),
    groups: z.array(z.object({
        id: z.string().optional(),
        title: z.object({
            ro: z.string(),
            ru: z.string(),
            en: z.string()
        })
    })).nullable(),
    questions: z.array(z.object({
        id: z.string().optional(),
        title: z.string(),
        optionFile: z.string().optional(),
        options: z.array(z.object({ content: z.string(), isAnswer: z.boolean(), order: z.number() }))
    })).optional(),
    deadline: z.string().optional(),
    isActive: z.boolean(),
    attempts: z.array(z.object({
        user: z.object({
            email: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            role: z.string(),
            id: z.string().optional()
        }).optional().nullable(), score: z.number(), submittedAt: z.string(), answers: z.array(z.object({ questionIndex: z.number(), selectedOptionIndex: z.number(), correct: z.boolean() }))
    })).nullable().optional(),
});

export const ExamsArraySchema = z.array(ExamsSchema).nullable();

export const ExamsResponseSchema = z.object({
    totalExams: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    examPerPage: z.number(),
    data: ExamsArraySchema
});

export const ExamsResponseMessagesSchema = z.object({
    message: z.string(),
    success: z.boolean()
})

export const ExamsQuestionsSchema = z.object({
    id: z.string().optional(),
    title: z.string().refine(
        (val) => val.replace(/<(.|\n)*?>/g, "").trim().length > 0,
        {
            message: {
                ro: "Introduceți conținutul titlul",
                ru: "Введите содержимое название",
                en: "Enter the exam title"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }
    ),
    optionFile: z.string().optional(),
    options: z.array(
        z.object({
            content: z.string().min(1, {
                message: {
                    ro: "Introduceți răspunsul",
                    ru: "Введите вариант ответа",
                    en: "Enter the answer option"
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            }),
            isAnswer: z.boolean(),
            order: z.number()
        })
    ).min(2, {
        message: {
            ro: "Introduceți cel puțin două variante de răspuns",
            ru: "Введите как минимум два варианта ответа",
            en: "Enter at least two answer options"
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }).refine(
        (opts) => opts.some((o) => o.isAnswer === true),
        {
            message: {
                ro: "Alegeți cel puțin un răspuns corect",
                ru: "Выберите хотя бы один правильный ответ",
                en: "Select at least one correct answer"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }
    )
})

export const ExamsFormSchema = z.object({
    id: z.string().optional(),
    title: z.object({
        ro: z.string().min(1, {
            message: {
                ro: "Introduceți titlul testului în română",
                ru: "Введите название теста на румынском",
                en: "Enter the exam title in Romanian"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        ru: z.string().min(1, {
            message: {
                ro: "Introduceți titlul testului în rusă",
                ru: "Введите название теста на русском",
                en: "Enter the exam title in Russian"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        en: z.string().min(1, {
            message: {
                ro: "Introduceți titlul testului în engleză",
                ru: "Введите название теста на английском",
                en: "Enter the exam title in English"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        })
    }),
    description: z.object({
        ro: z.string().min(1, {
            message: {
                ro: "Introduceți descrierea testului în română",
                ru: "Введите описание теста на румынском",
                en: "Enter the exam description in Romanian"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        ru: z.string().min(1, {
            message: {
                ro: "Introduceți descrierea testului în rusă",
                ru: "Введите описание теста на русском",
                en: "Enter the exam description in Russian"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        en: z.string().min(1, {
            message: {
                ro: "Introduceți descrierea testului în engleză",
                ru: "Введите описание теста на английском",
                en: "Enter the exam description in English"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        })
    }),
    content: z.object({
        ro: z.string().min(1, {
            message: {
                ro: "Introduceți conținutul testului în română",
                ru: "Введите содержимое теста на румынском",
                en: "Enter the exam content in Romanian"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        ru: z.string().min(1, {
            message: {
                ro: "Introduceți conținutul testului în rusă",
                ru: "Введите содержимое теста на русском",
                en: "Enter the exam content in Russian"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        en: z.string().min(1, {
            message: {
                ro: "Introduceți conținutul testului în engleză",
                ru: "Введите содержимое теста на английском",
                en: "Enter the exam content in English"
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        })
    }),
    imageUrl: z.string().optional(),
    slug: z.string().optional(),
    createdBy: z.string(),
    responsible: z.array(
        z.string()
    ).min(1, {
        message: {
            ro: "Selectați cel puțin un responsabil",
            ru: "Выберите хотя бы одного ответственного",
            en: "Select at least one responsible user"
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
    lessons: z.array(
        z.string()
    ).nullable().optional(),
    groups: z.array(
        z.string()
    ).nullable().optional(),
    questions: z.array(
        z.object({
            id: z.string().optional(),
            title: z.string().refine(
                (val) => val.replace(/<(.|\n)*?>/g, "").trim().length > 0,
                {
                    message: {
                        ro: "Introduceți conținutul titlul",
                        ru: "Введите содержимое название",
                        en: "Enter the exam title"
                    } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
                }
            ),
            optionFile: z.string().optional(),
            options: z.array(
                z.object({
                    content: z.string().min(1, {
                        message: {
                            ro: "Introduceți răspunsul",
                            ru: "Введите вариант ответа",
                            en: "Enter the answer option"
                        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
                    }),
                    isAnswer: z.boolean(),
                    order: z.number()
                })
            ).min(2, {
                message: {
                    ro: "Introduceți cel puțin două variante de răspuns",
                    ru: "Введите как минимум два варианта ответа",
                    en: "Enter at least two answer options"
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            }).refine(
                (opts) => opts.some((o) => o.isAnswer === true),
                {
                    message: {
                        ro: "Alegeți cel puțin un răspuns corect",
                        ru: "Выберите хотя бы один правильный ответ",
                        en: "Select at least one correct answer"
                    } as any // eslint-disable-line @typescript-eslint/no-explicit-any
                }
            )
        })
    ).min(1, {
        message: {
            ro: "Introduceți cel puțin o întrebare",
            ru: "Добавьте хотя бы один вопрос",
            en: "Add at least one question"
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
    deadline: z.string().optional(),
    isActive: z.boolean(),
    attempts: z.array(
        z.object({
            user: z.string(),
            score: z.number(),
            submittedAt: z.string(),
            answers: z.array(
                z.object({
                    questionIndex: z.number(),
                    selectedOptionIndex: z.number(),
                    correct: z.boolean()
                })
            )
        })
    ).nullable().optional(),
    timer: z.number().optional()
});

export const Option = z.object({
    content: z.string(),
    isAnswer: z.boolean(),
    order: z.number()
});

export const Question = z.object({
    title: z.string(),
    options: z.array(Option)
});

export const ExamOptionsSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    optionFile: z.string().optional(),
    options: z.array(z.object({ content: z.string(), isAnswer: z.boolean(), order: z.number() }))
});

export const ExamAttemptsSchema = z.object({
    id: z.string().optional(),
    user: z.object({
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        role: z.string(),
        id: z.string().optional()
    }).optional().nullable(),
    score: z.number(),
    submittedAt: z.string(),
    answers: z.array(
        z.object({
            id: z.string().optional(),
            correct: z.boolean(),
            questionIndex: z.number(),
            selectedOptionIndex: z.number()
        })
    )
});

export const ExamsAttemptResponseSchema = z.object({
    title: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    attempt: ExamAttemptsSchema
});

export const ExamsResponseAttemptsSchema = z.object({
    totalExams: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    examPerPage: z.number(),
    data: z.array(ExamsAttemptResponseSchema)
});

export const SubmitExamSchema = z.object({
    examId: z.string().min(1, {
        message: {
            ro: "ID-ul testului este obligatoriu",
            ru: "ID экзамена обязателен",
            en: "Exam ID is required",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
    userId: z.string().min(1, {
        message: {
            ro: "ID-ul utilizatorului este obligatoriu",
            ru: "ID пользователя обязателен",
            en: "User ID is required",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
    answers: z.array(
        z.object({
            questionIndex: z.number().int().min(0, {
                message: {
                    ro: "Introduceți indexul întrebării",
                    ru: "Укажите индекс вопроса",
                    en: "Provide question index",
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            }),
            selectedOptionIndex: z.number().int().refine(val => val >= 0, {
                message: {
                    ro: "Alegeți varianta de răspuns",
                    ru: "Выберите вариант ответа",
                    en: "Select answer option",
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            }),
        })
    ).min(1, {
        message: {
            ro: "Trimiteți cel puțin un răspuns",
            ru: "Должен быть хотя бы один ответ",
            en: "At least one answer is required",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
});

export const SubmitExamResponseSchema = z.object({
    success: z.boolean(),
    score: z.number()
})



export type Exams = z.infer<typeof ExamsSchema>;
export type ExamsArray = z.infer<typeof ExamsArraySchema>;
export type ExamsResponse = z.infer<typeof ExamsResponseSchema>;
export type ExamsResponseMessages = z.infer<typeof ExamsResponseMessagesSchema>;
export type ExamsForm = z.infer<typeof ExamsFormSchema>;
export type ExamsQuestions = z.infer<typeof ExamsQuestionsSchema>;
export type SubmitExam = z.infer<typeof SubmitExamSchema>;
export type SubmitExamResponse = z.infer<typeof SubmitExamResponseSchema>;
export type ExamOptions = z.infer<typeof ExamOptionsSchema>;
export type ExamAttempts = z.infer<typeof ExamAttemptsSchema>;
export type ExamsResponseAttempts = z.infer<typeof ExamsResponseAttemptsSchema>;
export type ExamsAttemptResponse = z.infer<typeof ExamsAttemptResponseSchema>;