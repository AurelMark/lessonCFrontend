import { z } from 'zod';

export const HistoryLogsSchema = z.object({
    ip: z.string(),
    method: z.string(),
    url: z.string(),
    userAgent: z.string().optional(),
    os: z.string().optional(),
    browser: z.string().optional(),
    deviceType: z.string().optional(),
    login: z.string().optional(),
    status: z.string().optional(),
    attemptedLogin: z.object({
        login: z.string(),
        password: z.string()
    }).optional(),
    createdAt: z.string().optional()
});

export const HistoryLogsArraySchema = z.array(HistoryLogsSchema);

export const HistoryLogsResponseSchema = z.object({
    success: z.boolean(),
    total: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    statsPerPage: z.number(),
    data: HistoryLogsArraySchema
})

export type HistoryLogs = z.infer<typeof HistoryLogsSchema>;
export type HistoryLogsArray = z.infer<typeof HistoryLogsArraySchema>;
export type HistoryLogsResponse = z.infer<typeof HistoryLogsResponseSchema>;